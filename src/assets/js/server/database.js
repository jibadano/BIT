/*
 * 	Database 0.0.1
 *
 *	jibadano@gmail.com
 *	Date: 2015-11-24
 */

/*	Global	*/
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

mongoose.connect('mongodb://localhost/db');

/*	Schemas	*/
var pollSchema = new mongoose.Schema({
	question: String,
	date: { type: Date, default: Date.now },
	options: [{desc: String, users: [{ type: ObjectId, ref: 'User'}]}],
	owner: { type: ObjectId, ref: 'User'},
	categories: [{ type: ObjectId, ref: 'Category'}],
	image: { data: Buffer, contentType: String },
	privacy: {public:Boolean, showResult: Boolean, users: [{ type: ObjectId, ref: 'User'}]}
});

var userSchema = new mongoose.Schema({
	email: {type:String, required:true, unique:true},
	password: {type:String, required:true},
	firstname: String,
	lastname: String,
	admin: { type: Boolean, default: false },
	following: [{ type: ObjectId, ref: 'User'}],
	followers: [{ type: ObjectId, ref: 'User'}],
	polls: [{ type: ObjectId, ref: 'Poll'}]
});

var categorySchema = new mongoose.Schema({
	name:String,
	polls:Number
});

var logSchema = new mongoose.Schema({
	type: String,
	date: { type: Date, default: Date.now },
	serviceId: String,
	data: String,
	user: String
});



/*	Models	*/
exports.User = mongoose.model('User', userSchema);
exports.Poll = mongoose.model('Poll', pollSchema);
exports.Category = mongoose.model('Category', categorySchema);
var Log = mongoose.model('Log', logSchema);


/* Methods */
//INSERT

function log(type, serviceExecution){
	new Log({type:type, user:serviceExecution.user, serviceId: serviceExecution.serviceId, data : JSON.stringify(serviceExecution.data)})
	.save();
}




/* Exports */

//User
exports.log = log;