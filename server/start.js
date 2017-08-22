/*
 * 	Start 0.0.2
 *
 *	jibadano@gmail.com
 *	Date: 2015-11-24
 */
//Modules
var express = require('express');
var app = express();

//Server modules
var config = require('./config');
var requestHandler = require('./requestHandler');
var database = require('./database');

requestHandler.init();
database.init();

//Config application
app.use(express.static('./dist'));
app.set('trust proxy', 1) // trust first proxy

//Router
app.get('*', function(req, res) {
    res.sendfile('./dist/index.html');
});
app.post('/services', requestHandler.exec);

//Run server
app.listen(config.serverPort,config.serverHost);

console.log(' ');
console.log('***********************************************************************');
console.log('*************************** BIT is running ****************************');
console.log('***********************************************************************');
console.log(' ');
console.log(' ');

