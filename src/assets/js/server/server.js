/*
 * 	Server 0.0.1
 *
 *	jibadano@gmail.com
 *	Date: 2015-11-24
 */


function init(app){
	var server = app.listen(app.locals.port,app.locals.host);
	console.log('Server is running at ' + app.locals.host + ':' + app.locals.port);
}

exports.init = init;
