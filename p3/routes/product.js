/*
 * author: QIYANG HE
 * Description: user operation, including:
 *  view products
 */

const express = require('express')
const app = express.Router()
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(express.json());       // to support JSON-encoded bodies
const db = require('../connectDB.js')
//load configuration
// const config = require('../baseConfig.json')

app.post("/viewProducts",(request, response)=>{
	console.log("======== viewProducts ========")
	var group = request.body.group
	var asin = request.body.asin
	var keyword = request.body.keyword
	if(valid(group)&&valid(asin)&&valid(keyword)) {
		var sql = "SELECT t1.asin, t2.productName FROM (SELECT asin, productName FROM product WHERE asin = '"+asin+"'"+
		"AND pgroup = '"+group+"') AS t1, (SELECT asin, productName FROM product WHERE productName LIKE '%"+keyword+"%' COLLATE utf8_general_ci "+
		"OR productDescription LIKE '%"+keyword+"%' COLLATE utf8_general_ci) AS t2 WHERE t1.asin = t2.asin"
	}else if(valid(group) && valid(asin)) {
		var sql = "SELECT asin, productName FROM product WHERE asin = '"+asin+"'AND pgroup = '"+group+"'"
	}else if(valid(group) && valid(keyword)) {
		var sql = "SELECT t1.asin, t2.productName FROM (SELECT asin, productName FROM product WHERE pgroup = '"+group+
		"') AS t1, (SELECT asin, productName FROM product WHERE productName LIKE '%"+keyword+"%' COLLATE utf8_general_ci "+
		"OR productDescription LIKE '%"+keyword+"%' COLLATE utf8_general_ci) AS t2 WHERE t1.asin = t2.asin"
	}else if(valid(asin) && valid(keyword)) {
		var sql = "SELECT t1.asin, t2.productName FROM (SELECT asin, productName FROM product WHERE asin = '"+asin+
		"') AS t1, (SELECT asin, productName FROM product WHERE productName LIKE '%"+keyword+"%' COLLATE utf8_general_ci "+
		"OR productDescription LIKE '%"+keyword+"%' COLLATE utf8_general_ci) AS t2 WHERE t1.asin = t2.asin"
	}else if(valid(asin)) {
		var sql = "SELECT asin, productName FROM product WHERE asin = '"+asin+"'"
	}else if(valid(group)) {
		var sql = "SELECT asin, productName FROM product WHERE pgroup = '"+group+"'"
	}else if(valid(keyword)) {
		var sql = "SELECT asin, productName FROM product WHERE productName LIKE '%"+keyword+"%' COLLATE utf8_general_ci "+
		"OR productDescription LIKE '%"+keyword+"%' COLLATE utf8_general_ci"
	}else{
		var sql = "SELECT asin, productName FROM product"
	}

	db.search(sql, (err, result)=>{
		if(err) console.log(err)
		if(result.length === 0) {
			response.json({"message": "There are no products that match that criteria"})
		}else {
			var json = JSON.parse(JSON.stringify(result))
			response.json({"product": json})
		}
	})
})


app.post("/buyProducts", (request, response) => {
	console.log("======== buyProducts ========")
	var userid = request.session.userid
	if(!request.session.user) {
		response.json({"message": "You are not currently logged in"})
	}else if(request.body.products.length === 0){
		response.json({"message": "There are no products that match that criteria"})
	}else{
		//create hashmap of the products
		order = {}
		for(var i = 0; i <= request.body.products.length - 1; i++) {
			var key = request.body.products[i].asin;
			// console.log(key)
			if(Object.keys(order).includes(key)) order[key]++;
			else order[key] = 1;
		}
		// console.log(Object.keys(order))
		//check if there exists nonexist asin
		var sql = "SELECT asin FROM product WHERE asin In (";
		var keyset = Object.keys(order)
		for(var i in keyset) {
			// console.log(ele)
			sql += "'"+keyset[i]+"',";
		}
		sql = sql.substring(0, sql.length-1)+");"
		db.search(sql,(err, result)=>{
			if(err) {console.log(err)}
			if(result.length !== Object.keys(order).length) {
				console.log("nonexists asin in request")
				response.json({"message": "There are no products that match that criteria"})
			}else{
				//update order table
				var add_order = "INSERT INTO orders (userid, asin, quantity) VALUES ";
				for(var i in keyset) {
					add_order += "("+userid+",'"+keyset[i]+"',"+order[keyset[i]]+"),"
				}
				add_order = add_order.substring(0, add_order.length-1)+";"
				db.update(add_order,(err, result)=>{
					if(err) console.log(err);
					//update recommendation table
					var add_recom = "INSERT INTO recommend (mainProduct, recommendProduct, quantity) VALUES	";
					
					for(var i in keyset) {
						for(var j in keyset) {
							if(i !== j) {
								add_recom += "('"+keyset[i]+"','"+keyset[j]+"',"+order[keyset[j]]+"),"
							} 
						}
					}
					add_recom = add_recom.substring(0, add_recom.length-1)+";"
					if(keyset.length > 1){
						db.update(add_recom,(err, result)=>{
							if(err) console.log(err);
							response.json({"message": 'The action was successful'})
						})
					}else{
						response.json({"message": 'The action was successful'})
					}
				});
			}
		})
	}
})

app.post("/getRecommendations", (request, response) => {
	console.log("======== getRecommendations ========")
	if(!request.session.user) {
		response.json({"message": "You are not currently logged in"})
	}else if(request.body.asin === undefined || request.body.asin === null){
		response.json({"message": "There are no recommendations for that product"})
	}else{
		//check if the query product exists
		var sql = "SELECT recommendProduct, SUM(quantity) AS seq FROM recommend WHERE "+
		"mainProduct = '"+request.body.asin+"' Group By recommendProduct ORDER BY seq DESC LIMIT 5;"
		db.search(sql, (err, result)=>{
			if(err) console.log(err);
			if(result.length ===0) {
				response.json({"message": "There are no recommendations for that product"})
			}else{
				console.log(result)
				var recommendation = []
				for(var i in result){
					var obj = {}
					obj['asin'] = result[i]['recommendProduct']
					recommendation.push(obj)
				}
				response.json({"message": 'The action was successful',"products":recommendation})
			}
		})
	}
})




//helper function, define if valid input
var valid = function(s) {
	if(s === undefined || s === null) return false;
	else return true;
}


module.exports = app;