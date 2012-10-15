var http = require('http'),
	fs = require('fs'),
	util = require('util'),
	OAuthSimple = require('OAuthSimple'),
	mikealRequest = require('request');

fs.readFile('./config.json', "utf8", function(error, result) {
	if (error) throw error;
	var config = JSON.parse(result)

	oauth = new OAuthSimple(config.consumerKey, config.sharedSecret)
    var request = oauth.sign({
      action: "GET",
      path: 'http://api.netflix.com/catalog/titles/full',
      parameters: { v: '2.0' }
    });

	console.log(request.signed_url);
	mikealRequest(request.signed_url).pipe(fs.createWriteStream('./data/netflix-full-catalog'))
});

