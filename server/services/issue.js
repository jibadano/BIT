const Issue = require('../database').Issue;

exports.addIssue = function(data, then){
	new Issue(data.task).save(then);
}

exports.delIssue = function(data, then){
	Issue.findOneAndRemove({_id: data.task._id},then);
}

exports.getIssue = function(data, then){
	Issue.findOne({_id: data.task._id}).
	exec(then);
}

exports.getIssues = function(data, then){
	Issue.find({task:false}).
	sort({ date: -1 }).
	exec(then);
}

exports.getTasks = function(data, then){
	Issue.find({task:true}).
	sort({ date: -1 }).
	exec(then);
}

exports.updIssue = function(data, then){
	Issue.findOne(data.task, function(err,task){
		if(err)
			return then(err, null);

		if(!task)
			return then(eh.USER.NOT_FND, null);
		
		task = se.data.task;
		task.save(then);
	});
}