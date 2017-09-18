const Issue = require('../database').Issue;
const eh = require('../errorHandler');

exports.addIssue = function(data, then){
	new Issue(data.issue).save(then);
}

exports.delIssue = function(data, then){
	Issue.findOneAndRemove({_id: data.issue._id},then);
}

exports.getIssue = function(data, then){
	Issue.findOne({_id: data.issue._id}).
	exec(then);
}

exports.getIssues = function(data, then){
	Issue.find({task:false}).
	sort({ date: -1 }).
	exec(then);
}

exports.getTasks = function(data, then){
	Issue.find({task:true, release:null}).
	sort({ date: -1 }).
	exec(then);
}

exports.updIssue = function(data, then){
	Issue.findOne({_id:data.issue._id}, function(err,issue){
		if(err)
			return then(err, null);

		if(!issue)
			return then(eh.USER.NOT_FND, null);

		issue.title = data.issue.title;
		issue.assignee = data.issue.assignee;
		issue.resolution = data.issue.resolution;
		issue.ocurrences = data.issue.ocurrences;
		issue.ticket = data.issue.ticket;
		issue.task = data.issue.task;
		issue.environments = data.issue.environments;
		issue.view = data.issue.view;
		issue.demand = data.issue.demand;
		issue.ticket = data.issue.ticket;

		issue.save(then);
	});
}