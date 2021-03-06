/*
lineReader will extract the records from amazon-meta.txt one at a time as
file is too large to read all at once.  In order to add records to a database you need to add code below to insert records

This code depnds on "line-reader"

You need to install line-reader by using the following command:
npm install line-reader

*/

//This assumes that you're using mysql.  You'll need to change this if you're using another database
var mysql      = require('mysql'),
    co         = require('co'),
    wrapper    = require('co-mysql');
// const config = require('./baseConfig.json'); 
const config = require('./connectAWS.json'); 

var query;
var jsonRecord;
var execute = true;
var query;
var totalRecords = 0;

var lineReader = require('line-reader');


/*************************You need to change this to be appropriate for your system************************************************************/
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.user,
  password : config.password,
  database : config.database,
  multipleStatements: 'true'
});

var sql = wrapper(connection);

var values = ""; //The records read from the file.
// var pairs = []; //The records read from the file.
var numRecords = 0; //The current number of records read from the file.

/********************************You might need to adjust the block size.  This specifies how many records to insert at once***********************/
var recordBlock = 1000; //The number of records to write at once.

lineReader.eachLine('./projectRecordsJSON.json', function(line, last) {
  execute = false;
  currentLine = line.toString().replace(/'/g, "\"", "g").replace("'","''");
  try{
    jsonRecord = JSON.parse(currentLine);


    if (numRecords) {
      values += ', ';
    }
    if(jsonRecord.description == null){
      jsonRecord.description = "";
    }
    // var tmp = [jsonRecord.title.toString().trim(),jsonRecord.categories[0][0].toString().trim(),jsonRecord.description.toString().trim(),jsonRecord.asin.toString().trim()]
    // values.push(tmp)
    values += `('${jsonRecord.title.toString().trim()}', '${jsonRecord.categories[0][0].toString().trim()}', '${jsonRecord.description.toString().trim()}', '${jsonRecord.asin.toString().trim()}')`;
    numRecords++;

//****************************************************Change the query to align with your schema******************************************************/
    if (numRecords == recordBlock) {
      // query = `INSERT INTO product (productName, pgroup, productDescription, asin) VALUES (?);`; //Template, replaces ${values} with the value of values.
      query = `INSERT INTO product (productName, pgroup, productDescription, asin) VALUES ${values};`; //Template, replaces ${values} with the value of values.
      values = "";
      numRecords = 0;
      execute = true;
    }
  }catch(err) {
    execute = false;//there was a quote in the text and the parse failed ... skip insert
    console.log(err);
    console.log(query);
  }
  if(execute){
    co(function* () {
      // console.log("****************************************************in execute**************************************************************************************");
        var resp = yield sql.query(query,values);
        // values = [];
        console.log("resp = " + resp);
        totalRecords += recordBlock;
        console.log(totalRecords + " records inserted.");
    });
  }//if(execute)
});//lineReader.eachLine
