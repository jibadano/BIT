const db = require('../database');

exports.search = function(data, then){
	return then(null,db.layouts);

}

exports.searchLayouts = function(data, then){
	if(se.data.searchTarget.indexOf('layouts') >= 0){
		db.environments.DESA.sql.close();
		var request = new db.environments.DESA.sql.Request();
 		request.query('select top 10 nombre_concatenado,version from dbo.layout', function (err, recordset) {
			console.log(recordset);
			if (err) console.log(err)
				return then(null,recordset);
		});
	} 
	else
		return then(null,[]);
}

exports.searchWorkflows = function(data, then){
	
	if(se.data.searchTarget.indexOf('workflows') >= 0){
		if(db.workflows)
			db.workflows.resultset.forEach(function(workflow){
				workflow.componentType='wf';
			});
		return then(null,db.workflows.resultset);
	} 
	else
		return then(null,[]);
}

exports.cmmSearch = function(data, then){
	return then(null,db.cmm.resultset);
}


function searchLayouts(env,searchTerm, then){
	sql[env].close();
	sql[env].connect(db.environments[env].config, function (err) {
		if (err) console.log(err);

		var request = new sql[env].Request();
		var query = 'select top 10 nombre_concatenado, version from dbo.layout where nombre_concatenado like \'%' + searchTerm + '%\'';
		console.log(query);
		request.query(query, function (err, recordset) {
			console.log(recordset);
			if(recordset)
				return then(err,recordset.recordset);
			else
				return then(err,[]);
		});
	});
}

