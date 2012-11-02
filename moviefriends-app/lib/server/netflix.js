var fs = require('fs'),
	util = require('util'),
	OAuthSimple = require('OAuthSimple'),
	request = require('request'),
	_u = require('underscore'),
	XmlStream = require('xml-stream'),
	mongo = require('mongodb');

function sanitize(s) {
    return s.replace(/\//g, '').replace(/:/g, '').replace(/\./g, '');
}

exports.setup = function(store) {
	store.route('get', 'netflix.movies.2012', function(cb) {
		Server = mongo.Server,
		Db = mongo.Db;

		var server = new Server('localhost', 27017, {auto_reconnect: true});
		var db = new Db('moviefriends', server, {safe:true});
		movies = [];

		db.open(function(err, db) {
		  if(!err) {
			console.log('Connected');

			db.collection('netflixfull', {safe:true}, function(err, collection) {
				if(err) throw err;
				var cursor = collection.find({'release_year': '2012', 'id': /.*movies.*/ }, {'sort': {'average_rating': -1}});

				cursor.each(function(err, movie) {
					if(err) throw err;
					if(movie != null){
						// console.log('\n' + util.inspect(movie, false, null));
						var divId = sanitize(movie.id)

						movies.push(movie);			
					}
				});
				console.log('Done');
			});

			db.close();
		  }
		});
		console.log('Callback ',cb);
		cb(null, movies);
	});
};