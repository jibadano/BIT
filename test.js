var sql = require("mssql");
sql.close();
sql.connect({user:'FE_cb_desktop',password:'nUbzdbr35wow',server:'srappw048p000.terceros.banco.com.ar',database:'FE_techbank_view_dev_bs',port:49235}, function (err) {
	if (err) console.log(err);

	var request = new sql.Request();
	var query = 'select top 10 nombre_concatenado, version from dbo.layout where nombre_concatenado like  \'%a%\'';
	console.log(query);
	request.query(query, function (err, recordset) {
		console.log(recordset);
	});
});