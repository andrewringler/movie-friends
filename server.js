var http = require('http'),
	fs = require('fs'),
	util = require('util'),
	rest = require('restler'),
	OAuthSimple = require('OAuthSimple'),
	mikealRequest = require('request');

fs.readFile('./config.json', "utf8", function(error, result) {
	if (error) throw error;
	var config = JSON.parse(result)

	oauth = new OAuthSimple(config.consumerKey, config.sharedSecret)
    var request = oauth.sign({
      action: "GET",
      path: "http://api-public.netflix.com/catalog/titles",
      parameters: { term: 'rock', start_index: '0', max_results: '1', output: 'json' }
    });

	var options = {
		method: 'GET',
		headers: { 'accept-encoding': 'gzip,deflate' }
	};
	console.log(request.signed_url);

	mikealRequest(request.signed_url).pipe(fs.createWriteStream('./data/netflix-full-catalog'))
	
	// rest.request(request.signed_url, options).on('complete', function(result) {
	// 	if(result instanceof Error) {
	// 		console.log('Error\n' + result);
	// 	} else {
	// 		console.log('Success\n' + result);
	// 	}
	// });
});

