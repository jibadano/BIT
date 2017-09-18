var ssh = require('ssh-exec')

/*console.log(`
--------
BIP1290I: File 'commonSupportFlows/aggregateReply.esql' is deployed to execution group 'EG_DEBIN'.

Deployed: '9/8/17 4:54 PM' in Bar file '/home/mqsiuser/EntregaCMM_TU_46_2_CALI/workbenchCommon_flow-1.9.3-wmb8_timeout_60000_cambio_invoque.bar'
Last edited: '11/22/16 2:30 PM'
Keywords:`.split("'"));
*/

let std;
ssh('mqsilist BRK8PATAT01 -r -d2', {
  user: 'mqsiuser',
  host: '172.12.24.109',
  password: 'cH4ngeMe!'
}, function (err, stdout, stderr) {
  var deploys = [];
	stdout.split("--------").forEach(function(deployStr){
		splittedDeploy = deployStr.split("'");
		if(splittedDeploy.length==11){
			let i=0;
			splittedDeploy.forEach(function(value){
				console.log(i++ + " " + value);
			});
		}
	})
});