var http = require('http'),
	fs = require('fs'),
	util = require('util'),
	OAuthSimple = require('OAuthSimple'),
	request = require('request'),
	_u = require('underscore'),
	XmlStream = require('xml-stream'),
	mongo = require('mongodb');

function fullCatalogToFile() {
	fs.readFile('./config.json', "utf8", function(error, result) {
		if (error) throw error;
		var config = JSON.parse(result)

		oauth = new OAuthSimple(config.consumerKey, config.sharedSecret)
	    var signedRequest = oauth.sign({
	      action: "GET",
	      path: 'http://api.netflix.com/catalog/titles/full',
	      parameters: { v: '2.0' }
	    });

		console.log('GET ' + signedRequest.signed_url);
		request(signedRequest.signed_url).pipe(fs.createWriteStream('./data/netflix-full-catalog'))
	});
}

function getTitle(titleId) {
	fs.readFile('./config.json', "utf8", function(error, result) {
		if (error) throw error;
		var config = JSON.parse(result)

		oauth = new OAuthSimple(config.consumerKey, config.sharedSecret)
	    var signedRequest = oauth.sign({
	      action: "GET",
	      path: 'http://api-public.netflix.com/catalog/titles/movies/' + titleId,
	      parameters: { v: '2.0', output: 'json' }
	    });

		console.log('GET ' + signedRequest.signed_url);
		request(signedRequest.signed_url, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    console.log(body)
		  } else {
			console.log('error ' + util.inspect(error) + ' ' + util.inspect(response));
		  }
		})
	});
}

function streamFullCatalogToJSON(input, collection) {
	var stream = fs.createReadStream(input);
	var xml = new XmlStream(stream);

	xml.collect('category');
	xml.collect('link');
	xml.collect('availability');
	xml.on('error', function(error) {
		console.log('Error ' + error);
		throw error;
	});
	xml.on('updateElement: catalog_title', function(item) {
		// we don't need all of the data, also since we are required to poll every 24hrs
		// per Netflix service agreement we can always add more fields later tomorrow
		var doc = {}
		
		doc.id = item.id; // ie http://api.netflix.com/catalog/titles/movies/70058932
		doc.title = {};
		doc.title.regular = item.title['$'].regular;
		doc.title.short = item.title['$'].short;
		doc.release_year = item.release_year;
		doc.average_rating = item.average_rating;
		doc.updated = item.updated;

		_u.each(item.link, function(link) {
			// all entries do not seem to have all sizes, need to clean this
			if(link.hasOwnProperty('box_art')){
				var box_arts = link.box_art.link;
				var box_arty = _u.find(box_arts, function(box_art){
					return box_art['$'].title == '197pix width box art';
				});
				doc.box_art = {};
				doc.box_art['197'] = box_arty['$'].href;
			}
			
			if(link.hasOwnProperty('delivery_formats')){
				var delivery_formats = link.delivery_formats.availability;
				var instant = _u.find(delivery_formats, function(delivery_format) {
					return delivery_format.category[0]['$'].term == 'instant';
				});
				if(instant){
					doc.instant = {}
					doc.instant.runtime = instant.runtime;
					doc.instant.available_from = instant['$'].available_from;
					doc.instant.available_until = instant['$'].available_until;
				}
			}
		});
		
		if(doc.instant) {
			// console.log('\n' + util.inspect(doc, false, null));			
			collection.insert(doc);
			console.log('INSERT ' + doc.id);
		}
	});
}

function loadNetflixFullIntoMongoDb() {
	Server = mongo.Server,
	Db = mongo.Db;

	var server = new Server('localhost', 27017, {auto_reconnect: true});
	var db = new Db('moviefriends', server);

	db.open(function(err, db) {
	  if(!err) {
		console.log('Connected');
		db.createCollection('netflixfull', function(err, collection) {
			if(err) throw err;

			console.log('Inserting Netflix data into database')
			streamFullCatalogToJSON('data/netflix-full-catalog.Oct14.xml', collection);
			console.log('Done.')		
		});
	  }
	});	
}

// getTitle('70058932');
// db.netflixfull.find({'release_year': '2012', 'id': /.*movies.*/ }).count();

Server = mongo.Server,
Db = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('moviefriends', server);

db.open(function(err, db) {
  if(!err) {
	console.log('Connected');
	
	var movie = {};
	db.collection('netflixfull', {safe:true}, function(err, collection) {
		if(err) throw err;
		collection.findOne({'release_year': '2012', 'id': /.*movies.*/ }, function(error, item) {
			console.log('\n' + util.inspect(item, false, null));
			movie = item;
		});
	});
	
	// var movie = {};
	// db.collection('netflixfull', {safe:true}, function(err, collection) {
	// });
	
	http.createServer(function (req, res) {
	  res.writeHead(200, {'Content-Type': 'text/html'});
	  res.end('<!DOCTYPE html><html><body><p>'
		+'<h1>'+movie.title.regular+'</h1>'
		+'<img src="'+movie.box_art['197']+'"/>'
		+'<h3>'+movie.average_rating+'</h3>'
		+'<h3>'+movie.release_year+'</h3>'
		+'</p></body></html>');
	}).listen(1337, '127.0.0.1');
	console.log('Listening on http://127.0.0.1:1337/ ...');
  }
});