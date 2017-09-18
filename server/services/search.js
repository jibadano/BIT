const db = require('../database');
const eh = require('../errorHandler');

exports.search = function(data, then){
	//return then(null,db.layouts.resultset);
	searchLayouts(data,function(err,layouts){
		searchWorkflows(data,function(err,workflows){
			layouts = layouts.concat(workflows);
			return then(null,layouts);
		});
	});
}

var searchLayouts = function(data, then){
	if(data.searchTarget.indexOf('layouts') >= 0){
		getLayouts(db.environments.DESA.sql.request(), data.searchTerm, function(err,layoutsDesa){
			getLayouts(db.environments.TEST.sql.request(), data.searchTerm, function(err,layoutsTest){
				getLayouts(db.environments.HOMO.sql.request(), data.searchTerm, function(err,layoutsHomo){
					getLayouts(db.environments.PROD.sql.request(), data.searchTerm, function(err,layoutsProd){
						for(var i=0;i<layoutsDesa.length;i++){
							layoutsDesa[i].componentType = 'lo';
							layoutsDesa[i].testVersion = getVersion(layoutsDesa[i],layoutsTest);
							layoutsDesa[i].homoVersion = getVersion(layoutsDesa[i],layoutsHomo);
							layoutsDesa[i].prodVersion = getVersion(layoutsDesa[i],layoutsProd);
						}
						return then(null,layoutsDesa);
					});
				});
			});
		});
	} 
	else
		return then(null,[]);
}

var searchWorkflows = function(data, then){
	if(data.searchTarget.indexOf('workflows') >= 0){
		
		getWorkflows(db.environments.DESA.sql.request(), data.searchTerm, function(err,workflowsDesa){
			getWorkflows(db.environments.TEST.sql.request(), data.searchTerm, function(err,workflowsTest){
				getWorkflows(db.environments.HOMO.sql.request(), data.searchTerm, function(err,workflowsHomo){
					getWorkflows( db.environments.PROD.sql.request(), data.searchTerm, function(err,workflowsProd){
						for(var i=0;i<workflowsDesa.length;i++){
							workflowsDesa[i].componentType = 'wf';
							workflowsDesa[i].testVersion = getVersion(workflowsDesa[i],workflowsTest);
							workflowsDesa[i].homoVersion = getVersion(workflowsDesa[i],workflowsHomo);
							workflowsDesa[i].prodVersion = getVersion(workflowsDesa[i],workflowsProd);
						}
						return then(null,workflowsDesa);
					});
				});
			});
		});
	} 
	else
		return then(null,[]);
}

exports.cmmSearch = function(data, then){
	db.CMM.find({}).deepPopulate('core canonicals canonicals.core canonicals.canonicals canonicals.canonicals.core canonicals.canonicals.canonicals').exec((err,cmms)=>{
		return then(null,cmms);
	});
}

exports.searchServices = function(data,then){
	var req = db.environments.DESA.sql.request();
	var query = "";

	if(data.component.componentType=='lo')
		query = 'select a.name from layout l,layoutaction la, action a where l.nombre_concatenado like \'%' + data.component.nombre_concatenado + '%\' and l.id=la.layout_id and la.action_id=a.id';
	else
		query = 'select a.name from workflow w, workflowlayout wl, layoutaction la, action a where w.nombre_concatenado like \'%' + data.component.nombre_concatenado + '%\' and wl.workflow_id=w.id and wl.layout_id=la.layout_id and la.action_id=a.id';

	req.query(query, function (err, result) {
		if(result){
			db.CMM.find({name: { $in: getServiceList(result.recordset) }}).deepPopulate('core canonicals canonicals.core canonicals.canonicals canonicals.canonicals.core canonicals.canonicals.canonicals').exec((err,cmms)=>{
				return then(null,cmms);
			});
		}
		else
			return then(err,[]);
	});
}

function getServiceList(services){
	var result = [];
	if(services){
		for(let service of services)
			result.push(service.name);
	}
	return result;
}

function getLayouts(req, searchTerm, then){
	if(req)
		req.query('select top 10 nombre_concatenado, version from dbo.layout where nombre_concatenado like \'%' + searchTerm + '%\'', function (err, recordset) {
			if(recordset)
				return then(err,recordset.recordset);
			else
				return then(err,[]);
		});
	else
		return then(err,[]);
}


function getWorkflows(req,searchTerm, then){
	if(req)
		req.query('select top 10 nombre_concatenado, version from dbo.workflow where nombre_concatenado like \'%' + searchTerm + '%\'', function (err, recordset) {
			if(recordset)
				return then(err,recordset.recordset);
			else
				return then(err,[]);
		});
	else
		return then(err,[]);
}

function getVersion(comp, componentList){
	var result = componentList.find(function(c){
		return comp.nombre_concatenado == c.nombre_concatenado;
	});
	if(result)
		return result.version;
	
	return -1;
}