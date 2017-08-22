const db = require('../database');
var ajax = require('ajax-request');

exports.getEnvironments = function(data, then){
	var env = {};
	env.DESA = {name:'DESA',url:db.environments.DESA.url, updated: db.environments.DESA.updated};
	env.TEST = {name:'TEST',url:db.environments.TEST.url, updated: db.environments.TEST.updated};
	env.HOMO = {name:'HOMO',url:db.environments.HOMO.url, updated: db.environments.HOMO.updated};
	env.PROD = {name:'PROD',url:db.environments.PROD.url, updated: db.environments.PROD.updated};
	then(null,env);
}

exports.testEnvironment = function(data, then){
	ajax({url: data.url, method: 'GET'}, function(err){
		return then(err,null);
	});
}
