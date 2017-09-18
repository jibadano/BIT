const fs = require('fs');
const db = require('./server/database');
fs.readFile('./orquestados.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var splitted = data.split("\r\n");
  let lastService = splitted[0].split(/[ \t]/)[1];
  let canonicos = [];
  for(let c of splitted){
	 let orquestado = c.split(/[ \t]/);
	 
	 if(lastService == orquestado[1]){
		 canonicos.push(orquestado[0]);
	 }
	 else{
		 let name = lastService;
		 db.CMM.find({name:{$in:canonicos}},function(err,cmms){
			 new db.CMM({name:name,canonicals:cmms}).save();
		});
		lastService = orquestado[1];
		canonicos = [];
	 }
  }
});