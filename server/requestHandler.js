/*
 * 	Request Handler 0.0.1
 *
 *	jibadano@gmail.com
 *	Date: 2015-11-24
 */
var config = require('./config');
var eh = require('./errorHandler');
var fs = require('fs');

/********************************************************************
************************** Config & Init ****************************
*********************************************************************/
var services = {};
exports.init = function(req,res){
	try{
		importService(config.servicesDir);
	}
	catch(e){console.log(e);}
}

function importService(file){
	if(fs.statSync(file).isDirectory()){
		fs.readdirSync(file).forEach(newFile => {
			importService(file + newFile);
		});
	}
	else{
		let module = require(getModule(file));
		Object.keys(module).forEach(serviceId=>{
			services[serviceId] = module[serviceId];
		});
	}
}

function getModule(filePath){
	var module = "."
	var splittedFilePath = filePath.split("/");
	for(var i=2; i<splittedFilePath.length; i++)
		module += "/" + splittedFilePath[i];
	
	return module;
}


exports.exec = function(req, res) {
	getData(req, function(serviceExecution){
		try{
			services[serviceExecution.serviceId](serviceExecution.data, function(err, data){
				serviceExecution.data = data;
				serviceExecution.err = getError(err);

				res.end(JSON.stringify(serviceExecution));
			});
		}
		catch(e){
			console.log(e);
			serviceExecution.data = null;
			serviceExecution.err = eh.SERVICE_EXECUTION(e, serviceExecution.serviceId);
			res.end(JSON.stringify(serviceExecution));
		}
	});
}

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