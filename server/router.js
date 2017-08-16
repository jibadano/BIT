/*
 * 	Router 0.0.1
 *
 *	jibadano@gmail.com
 *	Date: 2015-11-24
 */

function init(app,requestHandler){
	app.get('*', function(req, res) {
		 res.sendfile('./dist/index.html');
	});

	app.post('/services', requestHandler.exec);

}

exports.init = init;
