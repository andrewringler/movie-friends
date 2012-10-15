var http = require('http'),
	fs = require('fs'),
	util = require('util'),
	OAuthSimple = require('OAuthSimple'),
	request = require('request'),
	_u = require('underscore'),
	XmlStream = require('xml-stream');

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

function streamFullCatalogToJSON(input) {
	var stream = fs.createReadStream(input);
	var xml = new XmlStream(stream);

	xml.collect('category');
	xml.collect('link');
	xml.collect('availability');
	xml.on('updateElement: catalog_title', function(item) {
		// console.log('new item')
		// _u.each(item.link, function(link) {
		// 	console.log('l='+util.inspect(link, false, null));
		// });
		// _.each([1, 2, 3], function(num){ alert(num); });
		// 
		// item.link
		// 
		console.log(util.inspect(item, false, null));
	});
	// xml.on('endElement: catalog_title', function(item) {
	// 	console.log('\n'+item.id);
	// 	console.log(item.title['$'].regular);
	// 	console.log(item.link[0].box_art);
	// 	// console.log(util.inspect(item, false, null));
	// });	
}

// getTitle('70058932');
streamFullCatalogToJSON('data/play.xml');