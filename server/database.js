/*
 * 	Database 0.0.1
 *
 *	jibadano@gmail.com
 *	Date: 2015-11-24
 */

/*	Global	*/
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var environments = {};
mongoose.connect('mongodb://localhost/db');

/*	Schemas	*/
var taskSchema = new mongoose.Schema({
	title: String,
	issue:Boolean,
	assignee:String,
	reporter:String,
	branch:String,
	comment:String,
	resolution: String,
	ticket:String,
	date: { type: Date, default: Date.now },
	environment: {name:String},
	view:{
		rules:Boolean,
		styles:Boolean,
		masks:Boolean,
		components:[{componentType:String,nombre_concatenado:String,version:Number}]
		},
	cmm:{
		services:[{name:String,version:Number}],demands:[String]
	},
	teradata:{
		storedProcedures:[{name:String,version:Number}]
	},
	bpm:{
		services:[{name:String,version:Number}]
	},
	core:{
		services:[{name:String,version:Number}]
	}
});


var environmentSchema = new mongoose.Schema({
	name: String,
	url:String,
	config :{
		user: String,
		password: String,
		server: String, 
		database: String,
		port: Number
	}
});


/*	Models	*/
var Task = mongoose.model('Task', taskSchema);
var Environment = mongoose.model('Environment', environmentSchema);


Environment.find({},function(err,es){
	if(!err && es)
		es.forEach(function(e) {
			var sql = require("mssql");
			//sql.connect(e.config);
			var environment = {name:e.name,url:e.url,sql:sql,updated:new Date()};
			environments[e.name] = environment;
		});
});

/* Methods */

exports.layouts = {resultset:[
		{nombre_concatenado:'massiveSelectCustomeOperationConsolidadaFramework', version:'22'},
		{nombre_concatenado:'massiveSelectCustomeOperationConsolidadaFramework', version:'22'},
		{nombre_concatenado:'massiveSelectCustomeOperationStatusValores', version:'22'},
		{nombre_concatenado:'massiveSelectCustomeOperationAccounting', version:'122'},
		{nombre_concatenado:'massiveSelectCustomeOperationConsolidadaFramework', version:'232'},
		{nombre_concatenado:'massiveSelectCustomeOperationConsolidadaFramework', version:'422'}
	]
}

exports.workflows = {resultset:[
		{nombre_concatenado:'massiveSelectCustomeOperationConsolidadaFramework', version:'2322'},
		{nombre_concatenado:'massiveSelectCustomeOperationAccounting', version:'123'},
		{nombre_concatenado:'massiveSelectCustomeOperationConsolidadaFramework', version:'2523'},
		{nombre_concatenado:'massiveSelectCustomeOperationConsolidadaFramework', version:'1322'},
		{nombre_concatenado:'massiveSelectCustomeOperationConsolidadaFramework', version:'2342'},
		{nombre_concatenado:'massiveSelectCustomeOperationStatusValores', version:'42'}
	]
}

exports.cmm = {resultset:[
		{name:'massiveSelectCustomeOperationConsolidadaFramework', version:'2322'},
		{name:'massiveSelectCustomeOperationAccounting', version:'123'},
		{name:'massiveSelectCustomeOperationConsolidadaFramework', version:'2523'},
		{name:'massiveSelectCustomeOperationConsolidadaFramework', version:'1322'},
		{name:'massiveSelectCustomeOperationConsolidadaFramework', version:'2342'},
		{name:'massiveSelectCustomeOperationStatusValores', version:'42'}
	]
}

/* Exports */

exports.Task = Task;
exports.environments = environments;
