const mysql = require('mysql');

var con = mysql.createConnection({
	host : 'localhost',
	user : 'student',
	password : 'socrate'
});

con.connect(function(err) {
	if (err) throw err;
	console.log('COnnected !');
});