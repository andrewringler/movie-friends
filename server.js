var http = require('http'),
	fs = require('fs'),
	util = require('util'),
	rest = require('restler'),
	OAuthSimple = require('OAuthSimple');

fs.readFile('./config.json', "utf8", function(error, result) {
	if (error) throw error;
	var config = JSON.parse(result)

	oauth = new OAuthSimple(config.consumerKey, config.sharedSecret)
    request = oauth.sign({
      action: "GET",
      path: "http://api.netflix.com/catalog/people",
      parameters: { term: 'DeNiro' }
    });

	var options = {
		method: 'GET'
	};
	rest.request(request.signed_url, options).on('complete', function(result) {
		if(result instanceof Error) {
			console.log('Error\n' + result);
		} else {
			console.log('Success\n' + result);
		}
	});
});

