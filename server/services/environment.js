const db = require('../database');
var ajax = require('ajax-request');

exports.getEnvironments = function(data, then){
	then(null,db.environments);
}

exports.testEnvironment = function(data, then){
	ajax({url: data.url, method: 'GET'}, function(err){
		return then(err,null);
	});
}
