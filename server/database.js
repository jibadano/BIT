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
var sql = require("mssql");

mongoose.connect('mongodb://localhost/db',{ useMongoClient: true });

/*	Schemas	*/
var issueSchema = new mongoose.Schema({
	title: String,
	assignee:String,
	resolution: String,
	date: { type: Date, default: Date.now },
	ocurrences:[{
		date:Date,
		reporter:String,
		branch:String,
		time:String,
		user:String,
		customer:String,
		desc:String,
		images:[String]
	}],
	ticket:String,
	task:{ type: Boolean, default: false },
	environments: [String],
	view:{
		rules:Boolean,
		styles:Boolean,
		masks:Boolean,
		components:[{componentType:String,nombre_concatenado:String,version:Number, cmm:[{ type: ObjectId, ref: 'CMM'}] }]
	},
});

var cmmSchema = new mongoose.Schema({
	name: String,
	core: { type: ObjectId, ref: 'Core'},
	canonicals: [{ type: ObjectId, ref: 'CMM'}]
});

var coreSchema = new mongoose.Schema({
	name: String,
	origin: String,
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
exports.Issue = mongoose.model('Issue', issueSchema);
var CMM = mongoose.model('CMM', cmmSchema);
exports.CMM = CMM;
var Core = mongoose.model('Core', coreSchema);
exports.Core = Core;
var Environment = mongoose.model('Environment', environmentSchema);

exports.init = function(){
	Environment.find({},function(err,es){
		if(!err && es)
			for(var i=0;i<es.length;i++){
				environments[es[i].name] = {name:es[i].name,url:es[i].url,config:es[i].config,updated:new Date()};
				//environments[es[i].name].sql.close();
				//environments[es[i].name].sql = new sql.ConnectionPool(es[i].config, function (err) {
				//	if (err) console.log(err);
				//});
			}
	
	});

}

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

exports.environments = environments;
