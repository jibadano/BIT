/*
 * 	Router 0.0.1
 *
 *	jibadano@gmail.com
 *	Date: 2015-11-24
 */

function init(app,requestHandler){
	app.get('*', function(req, res) {
		 res.sendfile('./index.html');
	});
	app.post('/login', requestHandler.login);
	app.post('/logout', requestHandler.logout);
	app.post('/services', requestHandler.exec);
	app.post('/user',requestHandler.user );
	app.post('/forgot',requestHandler.forgotPassword );
	app.post('/signUp',requestHandler.signUp );

}

exports.init = init;
