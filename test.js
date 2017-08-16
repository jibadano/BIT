var request = require('ajax-request');



	request({
		url: 'http://172.12.24.130',
		method: 'GET'
		}, function(err, res, body) {
			console.log(res.statusCode);
		}
	);
