const Release = require('../database').Release;
const Issue = require('../database').Issue;
const eh = require('../errorHandler');
const ssh = require('ssh-exec');

exports.addRelease = function(data, then){
	new Release(data.release).save(function(err, release){

		data.release.issues.forEach(function(issue){
			Issue.findOne({_id:issue._id}, function(err,issue){

				issue.release = release;
				issue.save(then);
			});
		});

	});
}

exports.delRelease = function(data, then){
	Release.findOneAndRemove({_id: data.release._id},then);
}

exports.getRelease = function(data, then){
	Release.findOne({_id: data.release._id}).
	exec(then);
}

exports.getReleases = function(data, then){
	Release.find().populate('issues').
	sort({ date: -1 }).
	exec(then);
}

exports.updRelease = function(data, then){
	Issue.findOne({_id:data.release._id}, function(err,release){
		if(err)
			return then(err, null);

		if(!release)
			return then(eh.USER.NOT_FND, null);

		release.save(then);
	});
}

exports.getDeploys = function(data, then){
	ssh('mqsilist BRK8PATAT01 -r -d2', {
		user: 'mqsiuser',
		host: '172.12.24.109',
		password: 'cH4ngeMe!'
		}, function (err, stdout, stderr) {
			var deploys = [];
			stdout.split("--------").forEach(function(deployStr){
				splittedDeploy = deployStr.split("'");
				if(splittedDeploy.length==11){
					deploys.push({service:splittedDeploy[7], deployedDate:splittedDeploy[5], eg:splittedDeploy[3]});
				}
			});
			return then(null, deploys);
		});
}