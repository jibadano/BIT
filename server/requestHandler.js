/*
 * 	Request Handler 0.0.1
 *
 *	jibadano@gmail.com
 *	Date: 2015-11-24
 */

var db = require('./database');
var eh = require('./errorHandler');
var atob = require('atob');
var mail = require('./mail');
var request = require('ajax-request');

/********************************************************************
************************** Config & Init ****************************
*********************************************************************/



/********************************************************************
***************************** Services ******************************
*********************************************************************/

var services = {

//get Tasks
getTasks : function (se, then){
	db.Task.find({issue:null}).
	sort({ date: -1 }).
	exec(then);
},

//get Tasks
getIssues : function (se, then){
	db.Task.find({issue:true}).
	sort({ date: -1 }).
	exec(then);
},

//get Task
getTask : function (se, then){
	db.Task.findOne({_id:se.data.task._id}).
	exec(then);
},


// 3. ABM Task

//ADD Task
addTask : function (se, then){
	new db.Task(se.data.task).save(then);
},

//DEL TASK
delTask : function (se, then){
	db.Task.findOneAndRemove({_id:se.data.task._id},then);
},

//UPD TASK
updTask : function (se, then){
	db.Task.findOne(se.data.task, function(err,task){
		if(err)
			return then(err, null);

		if(!task)
			return then(eh.USER.NOT_FND, null);
		
		task = se.data.task;
		task.save(then);
	});
},

cmmSearch : function(se, then){
	return then(null,db.cmm.resultset);
},


search : function(se, then){
	services.searchLayouts(se,function(errLayouts,layouts){
		services.searchWorkflows(se,function(errWorkflows,workflows){
			layouts = layouts.concat(workflows);	
			return then(null,layouts);
		});	
	});
},

searchLayouts : function(se, then){
	
	if(se.data.searchTarget.indexOf('layouts') >= 0){
		if(db.layouts)
			db.layouts.resultset.forEach(function(layout){
				layout.componentType='lo';
			});
		return then(null,db.layouts.resultset);
	} 
	else
		return then(null,[]);
},
searchWorkflows : function(se, then){
	
	if(se.data.searchTarget.indexOf('workflows') >= 0){
		if(db.workflows)
			db.workflows.resultset.forEach(function(workflow){
				workflow.componentType='wf';
			});
		return then(null,db.workflows.resultset);
	} 
	else
		return then(null,[]);
},

testEnvironment : function(se, then){
	testUrl(se.data.url,function(err){
		then(err,null);
	});
},

getEnvironments : function (se, then){
	then(null,db.environments);
},

//SERVICES END
}

















/********************************************************************
************************** Global Services **************************
*********************************************************************/

/*
*								EXEC SERVICE
*/
function exec(req, res) {
	getData(req, function(serviceExecution){
		try{
			services[serviceExecution.serviceId](serviceExecution, function(err, data){
				serviceExecution.data = data;
				serviceExecution.err = getError(err);

				//Log RESPONSE
				res.end(JSON.stringify(serviceExecution));
			});
		}
		catch(e){
			console.log(e);
			delete serviceExecution.data;
			serviceExecution.err = eh.SERVICE_EXECUTION(e, serviceExecution.serviceId);
			res.end(JSON.stringify(serviceExecution));
		}
	});
}


/********************************************************************
****************************** Private ******************************
*********************************************************************/

var getData = function(req, then){
	var data = '';
	req.on('data', function(chunk){
		 data+=chunk;
	 });

	req.addListener('end',function (){
		try{
			then(JSON.parse(data));
		}catch(e){console.log(e)};
	});
}

var getError = function(err){
	if(!err)
		return null;
	else
		return (err.code)? err : eh.DATABASE(err);
}

var testUrl = function(url, then){
	request({
		url: url,
		method: 'GET'
		}, then
	);
}

/********************************************************************
****************************** Exports ******************************
*********************************************************************/

exports.exec = exec;


