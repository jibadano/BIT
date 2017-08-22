

const fs = require('fs');
const db = require('./server/database');
fs.readFile('./canonicos.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var splitted = data.split("\r\n")
  for(let c of splitted){
	 let canonico = c.split(/[ \t]/);
	 
	 db.Core.findOne({name:canonico[2]},function(err,core){
		 if(!core){
			 new db.Core({name:canonico[2], origin:canonico[1]}).save(function(err,newCore){
				 new db.CMM({name:canonico[0],core:newCore}).save();
			 });
		 }
		 else{
			  new db.CMM({name:canonico[0],core:core}).save();
		 }
	 });
  }
});