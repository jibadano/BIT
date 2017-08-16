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


/********************************************************************
************************** Config & Init ****************************
*********************************************************************/


/********************************************************************
***************************** Services ******************************
*********************************************************************/

var services = {



// 1.  USERS

//ADD USER
addUser : function (se, then){
	new db.User(se.data.user).save(then);
},

//DEL USER
delUser : function (se, then){
	db.User.findOneAndRemove(se.data.user,then);
},

//UPD USER
updUser : function (se, then){
	db.User.findOne(se.user, function(err,user){
		if(err)
			return then(err,null);

		if(!user)
			return then(eh.USER.NOT_FND,null);
		
		user = se.data.user;
		user.save(then);
	});
},





// 2. Search polls

//Explore polls
explorePolls : function (se, then){
	db.Poll.find().
	sort({ date: -1 }).
	exec(then);
},

//Home polls
homePolls : function (se, then){
	//TODO agregar al usuario logeado
	db.Poll.find({
		owner: { $in: se.user.following }
	}).
	sort({ date: -1 }).
	exec(then);
},

//User polls
userPolls : function (se, then){
	db.Poll.find({
		_id: { $in: se.user.polls }
	}).
	sort({ date: -1 }).
	exec(then);
},




// 3. ABM Poll

//ADD POLL
addPoll : function (se, then){
	new db.Polls(se.data.poll).save(then);
},

//DEL POLL
delPoll : function (user, data, then){
	db.Poll.findOneAndRemove(se.data.poll,then);
},

//UPD POLL
updPoll : function (user, data, then){
	db.Poll.findOne(se.data.poll, function(err,poll){
		if(err)
			return then(err, null);

		if(!poll)
			return then(eh.USER.NOT_FND, null);
		
		poll = se.data.poll;
		poll.save(then);
	});
},

//Vote
vote : function (se, then){
	db.Poll.findOne(se.data.poll, function(err,poll){
		if(err)
			return then(err, null);

		if(!poll)
			return then(eh.USER.NOT_FND, null);
		
		var selectedOption = poll.options.find(function(option){
			return option.desc == se.data.option.desc;
		});

		if(selectedOption){
			selectedOption.push(se.user);
			poll.save(then);
		}
		else
			return then(err,null);
	});
},

search : function(se, then){
	services.searchPolls(se,function(errPolls,polls){
		if(errPolls)
			return then(errPolls,null);
		services.searchCategories(se,function(errCategories,categories){
			if(errCategories)
				return then(errCategories,null);
			services.searchUsers(se,function(errUsers,users){
				if(errUsers)
					return then(errUsers,null);
				polls = polls.concat(categories);
				polls = polls.concat(users);
				return then(null,polls);
			});
		});
	});
},

searchPolls : function(se, then){
	if(se.data.searchTarget.indexOf('polls') >= 0)
		db.Poll.find({question: new RegExp('^.*'+se.data.searchTerm+'.*$', "i")},function(err,polls){
			if(err)
				return then(err,null);
			
			var result = [];
			for(var i = 0; i<polls.length; i++)
				result.push({type:'poll', desc: polls[i].question, _id: polls[i]._id});

			return then(null, result)
		});
	else
		return then(null,[]);
},

searchCategories : function(se, then){
	if(se.data.searchTarget.indexOf('categories') >= 0)
		db.Category.find({name: new RegExp('^.*'+se.data.searchTerm+'.*$', "i")},function(err,categories){
			if(err)
				return then(err,null);
			
			var result = [];
			for(var i = 0; i<categories.length; i++)
				result.push({type:'category', desc: categories[i].name, _id: categories[i]._id});

			return then(null, result)
		});
	else
		return then(null,[]);
},

searchUsers : function(se, then){
	if(se.data.searchTarget.indexOf('users') >= 0)
		db.User.find({email: new RegExp('^.*'+se.data.searchTerm+'.*$', "i")},function(err,users){
			if(err)
				return then(err,null);
			
			var result = [];
			for(var i = 0; i<users.length; i++)
				result.push({type:'user', desc: users[i].email, _id: users[i]._id});

			return then(null, result)
		});
	else
		return then(null,[]);
},

//SERVICES END
}

















/********************************************************************
************************** Global Services **************************
*********************************************************************/

/*
*								LOGIN
*/
function login(req, res) {
	if(req.session.user)
		return res.end(eh.USER.ALRDY_LOGGED_IN);

	var enc_auth = req.headers.authorization;
	var auth = atob(enc_auth.substring(6,enc_auth.length));

	var email = auth.split(':')[0];
	var password = auth.split(':')[1];

	db.User.findOne({email:email, password:password}, function(err, user) {
		if(err)
			return res.end(JSON.stringify({serviceId:'login',err: eh.DATABASE(err)}));

		if(!user)
			return res.end(JSON.stringify({serviceId:'login',err: eh.USER.AUTH_FAILED}));

		req.session.user = user;
		req.session.user.password = null;
		res.end(JSON.stringify({user:req.session.user}));
	});
}

/*
*								LOGOUT
*/
function logout(req, res) {
	delete req.session.user;
	res.end('{}');
}


/*
*							FORGOT PASSWORD
*/
function forgotPassword(req, res) {
	if(req.session.user)
		return res.end(eh.USER.ALRDY_LOGGED_IN);

	var enc_auth = req.headers.authorization;
	var auth = atob(enc_auth.substring(6,enc_auth.length));

	var email = auth.split(':')[0];

	db.User.find({email:email}, function(err, user) {
		if(err)
			return res.end(eh.DATABASE(err));

		if(!user)
			return res.end(eh.USER.AUTH_FAILED);

		mail.send(user.email,'forgot password','user: ' + user.email + ' password: ' + user.password);
		res.end();
	});
}


/*
*								SIGN UP
*/
function signUp(req, res) {
	if(req.session.user)
		return res.end(eh.USER.ALRDY_LOGGED_IN);

	var enc_auth = req.headers.authorization;
	var auth = atob(enc_auth.substring(6,enc_auth.length));

	var email = auth.split(':')[0];
	var password = auth.split(':')[1];

	var usr = {email: email, password: password};

	new db.User(usr).save(function(err,user){
		if(err)
			res.end(JSON.stringify(err));
			
		if(user){
			res.end(JSON.stringify(user));
			mail.send(user.email,'Welcome!!!!!','user: ' + user.email + ' password: ' + user.password);
		}
	});

}


/*
*						GET CURRENT USER
*/
function user(req, res){
	if(req.session.user)
		res.end(JSON.stringify({user:req.session.user}));
	else
		res.end('{}');
}




/*
*								EXEC SERVICE
*/
function exec(req, res) {
	getData(req, function(serviceExecution){
		try{
			//chequeo sesion
			if(!req.session.user){
				serviceExecution.err = eh.USER.SESSION_EXPIRED;
				return res.end(JSON.stringify(serviceExecution));
			}

			serviceExecution.user = req.session.user;
			
			//log REQUEST
			db.log("REQUEST",serviceExecution);

			services[serviceExecution.serviceId](serviceExecution, function(err, data){
				serviceExecution.data = data;
				serviceExecution.err = getError(err);

				//Log RESPONSE
				db.log("RESPONSE",serviceExecution);
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

/********************************************************************
****************************** Exports ******************************
*********************************************************************/


exports.logout = logout;
exports.login = login;
exports.exec = exec;
exports.user = user;
exports.forgotPassword = forgotPassword;
exports.signUp = signUp;

