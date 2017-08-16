/*
 * 	Request Handler 0.0.1
 *
 *	jibadano@gmail.com
 *	Date: 2015-11-24
 */


exports.GENERIC = function(err){
	return error("GENERIC", JSON.stringify(err));
}

exports.DATABASE = function(err){
	return error("DATABASE","Database error: " + JSON.stringify(err));
}

exports.SERVICE_EXECUTION = function(err, serviceId){
	return error("SERVICE_EXECUTION","Service id: " + serviceId + " message: " + err);
}

exports.USER = {
	AUTH_FAILED: {code:"USER_AUTH_FAILED",msg:"Authentication failed"},
	ALRDY_EXTS: {code:"USER_ALREADY_EXISTS",msg:"User already exists"},
	NOT_FND: {code:"USER_NOT_FOUND",msg:"No user found"},
	ALRDY_LOGGED_IN: {code:"USER_ALEARDY_LOGGED_IN",msg:"User already logged in"},
	SESSION_EXPIRED: {code:"USER_SESSION_EXPIRED",msg:"User session expired"}
};


var error = function(code,msg){
	return {code:code, msg:msg};
}

