const mysql = require('mysql');

//connect to mysql, read authentication info from json
const config = require('./baseConfig.json')

var con = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

con.connect(function(err, callback) {
  if (err) throw err;
  console.log("Connected!");
  // con.query("CREATE DATABASE p2", function (err, result) {
  //   if (err) throw err;
  //   console.log("Database created");
  // });
  // con.query("use ${config.database}", function (err, result) {
  //   if (err) throw err;
  // });
  con.query("DROP TABLE users;",function(err, result) {
    if(err) return;
    console.log("table user deleted");
  });
  con.query("DROP TABLE product;",function(err, result) {
    if(err) return;
    console.log("table product deleted");
  });
  con.query("DROP TABLE domains;",function(err, result) {
    if(err) return;
    console.log("table domains deleted");
  });
  con.query("DROP TABLE orders;",function(err, result) {
    if(err) return;
    console.log("table orders deleted");
  });
    con.query("DROP TABLE recommend;",function(err, result) {
    if(err) return;
    console.log("table recommend deleted");
  });

  //recreate tables
  con.query("CREATE TABLE users (ID INT AUTO_INCREMENT, username VARCHAR(255), password VARCHAR(255), fname VARCHAR(255),lname VARCHAR(255),"+
    "address VARCHAR(255), city VARCHAR(255), state VARCHAR(255), zip VARCHAR(255), email VARCHAR(255),"+
     "isadmin INT(255),UNIQUE(username),PRIMARY KEY (ID)) CHARACTER SET=utf8mb4 COLLATE = utf8mb4_unicode_ci;", function (err, result) {
    if (err) throw err;
    console.log("table users created");
  });
  con.query("INSERT INTO users (username, password, fname, lname, isadmin) VALUES ('jadmin', 'admin','Jenny','Admin', 1);", function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
  con.query("CREATE TABLE product (asin VARCHAR(255), productName LONGTEXT, productDescription LONGTEXT, pgroup VARCHAR(255), UNIQUE(asin), PRIMARY KEY (asin));", function (err, result) {
    if (err) throw err;
    console.log("table product created");
    // process.exit()
  });
  // con.query("CREATE INDEX asin_index ON orders(userid) USING BTREE;", function (err, result) {
  //   if (err) throw err;
  //   console.log("index build for product complete");
  //   // process.exit()
  // });
  con.query("CREATE TABLE domains (asin VARCHAR(255), pgroup VARCHAR(255));", function (err, result) {
    if (err) throw err;
    console.log("table domains created");
    // process.exit()
  });
  //*********************************************
  // the rest of which might be used by nosql db
  //*********************************************
  con.query("CREATE TABLE orders (userid INT, asin VARCHAR(255),quantity INT);", function (err, result) {
    if (err) throw err;
    console.log("table orders created");
    // process.exit()
  });
  con.query("CREATE INDEX userid_index ON orders(userid) USING BTREE;", function (err, result) {
    if (err) throw err;
    console.log("index build complete");
    // process.exit()
  });
  con.query("CREATE TABLE recommend (mainProduct VARCHAR(255), recommendProduct VARCHAR(255), quantity INT);", function (err, result) {
    if (err) throw err;
    console.log("table recommend created");
  });
  con.query("CREATE INDEX mainProduct_index ON recommend(mainProduct) USING BTREE;", function (err, result) {
    if (err) throw err;
    console.log("index build complete");
    process.exit()
  });

});



