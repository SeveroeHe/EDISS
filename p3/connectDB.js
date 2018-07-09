/*
 * author: QIYANG HE
 * Description: create database connection and provide manipulation functions
 */


var mysql = require('mysql');
const config = require('./baseConfig.json'); 

var pool = mysql.createPool({
  connectionLimit: 10,
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

// con.connect(function(err) {
// 	if (err) callback(err, null)
// });

exports.search = (sql, callback) =>{
	pool.getConnection((err, connection)=>{
		if(err) {
			// connection.release();
			callback(err, null);
		}else{
			console.log(sql)
			connection.query(sql, function (err, result) {
				connection.release();
		    	if (err) callback(err,null);
		    	else callback(null,result);
		  	});
		}
	})
}
exports.regist = (obj, callback) =>{
	// var sql = "INSERT INTO users (username, password, fname, lname, address, city, state, zip, email,"+
	// "isadmin) VALUES ( '"+obj.username+"','"+obj.password+"','"+obj.fname+"','"+obj.lname+"','"+
	// obj.address+"','"+obj.city+"','"+obj.state+"','"+obj.zip+"','"+obj.email+"','"+obj.isadmin+"');"
	var sql = "INSERT INTO users (username, password, fname, lname, address, city, state, zip, email,isadmin) VALUES (?);"
	pool.getConnection((err, connection)=>{
		if(err) {
			// connection.release();
			callback(err, null);
		}else {
			// console.log(sql)
			var values = [obj.username, obj.password, obj.fname,obj.lname,obj.address,obj.city,obj.state,obj.zip,
			 obj.email,obj.isadmin]
			connection.query(sql,[values], function(err, result){
				connection.release();
				if (err) callback(err,null);
				else callback(null, result);
			});
		}
	})
}

exports.addproduct = (obj, callback) =>{
	var sql = "INSERT INTO product (asin, productName, productDescription, pgroup) VALUES ('"+
	obj.asin+"','"+obj.productName+"','"+obj.productDescription+"','"+obj.group+"');"

	pool.getConnection((err, connection)=>{
		if(err) {
			// connection.release();
			callback(err, null);
		}else {
			console.log(sql)
			connection.query(sql, (err, result)=>{
				connection.release();
				if(err) callback(err, null);
				else callback(null, result);
			});
		}
	})
}

exports.update = (sql, callback) =>{
	pool.getConnection((err, connection)=>{
		if(err) {
			// connection.release();
			callback(err, null);
		}else {
			console.log(sql)
			connection.query(sql, (err, result) =>{
				connection.release();
				if(err) callback(err, null);
				else callback(null, result);
			})
		}
	})
}

exports.escape = (sql, values, callback) =>{
	pool.getConnection((err, connection)=>{
		if(err) {
			// connection.release();
			callback(err, null);
		}else {
			// console.log(sql)
			connection.query(sql, values, (err, result) =>{
				connection.release();
				if(err) callback(err, null);
				else callback(null, result);
			})
		}
	})
}

