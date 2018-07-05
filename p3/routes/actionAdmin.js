/*
 * author: QIYANG HE
 * Description: admin operation, including:
 *  add product / modify product / view users / view products
 */

const express = require('express')
const app = express.Router()
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(express.json());       // to support JSON-encoded bodies
const db = require('../connectDB.js')
//load configuration
// const config = require('../baseConfig.json')



app.post("/addProducts",(request, response) =>{
	console.log("======== addProducts ========")
	console.log(typeof request.body.group)
	if(!request.session.user) {
		response.json({"message": "You are not currently logged in"})
	}else{
		try{

			var sql = "SELECT * FROM users WHERE username='"+request.session.user+"'"
			db.search(sql, function(err, result){
				if (err) console.log(error)
				if(result[0].isadmin === 0) {
		    		response.json({"message": "You must be an admin to perform this action"})
		    		return
	    		}else {
	    			//perform action
	    			if(Object.keys(request.body).length !== 4) {
	    				response.json({"message": "The input you provided is not valid"})
	    				return
	    			}else {
	    				//check if fields are blank
	    				var obj = {}
	    				var pname = ""
	    				for(var key in request.body) {
	    					if(request.body[key] === null || request.body[key] === undefined) {
								console.log("empty field in addProduct")
								response.json({"message": "The input you provided is not valid"});
								return
							}else{
								if(key === "productName") {
	    							pname = request.body[key].replace("'","''")
	    						}
	    						obj[key] = request.body[key].replace("'","''")
							} 
	    				}
	    				db.addproduct(obj, (err, result) =>{
	    					if(err) response.json({"message": "The input you provided is not valid"})
	    					else {
	    						// var addgroup = "INSERT INTO domains (asin, pgroup) VALUES"
	    						response.json({"message": pname+" was successfully added to the system"})
	    					}
	    				})
	    			}
	    		}
			})
		}catch(err) {
			response.json({"message": "The input you provided is not valid"});
		}
	}
	
})



app.post("/modifyProduct", (request, response) =>{
	console.log("======== modifyProduct ========")
	if(!request.session.user) {
		response.json({"message": "You are not currently logged in"})
	}else{
		try{
			var sql = "SELECT * FROM users WHERE username='"+request.session.user+"'"
			db.search(sql, function(err, result){
				if (err) console.log(error)
				if(result[0].isadmin === 0) {
		    		response.json({"message": "You must be an admin to perform this action"})
		    		return
	    		}else {
	    			//can modify product (admin and logged in)
	    			if(Object.keys(request.body).length !== 4) {
	    				response.json({"message": "The input you provided is not valid"})
	    				return
	    			}else {
						var asin = ""
						var fields = ""
						var pname = ""
						for(var key in request.body) {
							if(request.body[key] === null || request.body[key] === undefined) {
								console.log("empty field in modify product")
								response.json({"message": "The input you provided is not valid"});
								return
							}else{
								if(key === "productName") {
		    						pname = request.body[key].replace("'","''")
		    					}else if(key === "asin") {
		    						asin = request.body[key]
		    					}
		    					if(key === "group") {
		    						fields += "pgroup = '"+request.body[key]+"',"
		    					}else{
		    						fields += key+" = '"+request.body[key].replace("'","''")+"',"
		    					}    					
							}
						}
						var sql = "UPDATE product SET "+fields.substring(0, fields.length-1)+" WHERE asin = '"+ asin+"'"
						console.log(sql)
						db.update(sql, (err, result)=>{
							if(err) {
								response.json({"message": "The input you provided is not valid"});
							}else {
	    						response.json({"message": pname+" was successfully updated"})
	    					}
	    				})
	    			}
	    		}
	    	})
		}catch(err) {
			response.json({"message": "The input you provided is not valid"});
		}
    }
})



app.post("/viewUsers", (request, response)=>{
	console.log("======== viewUsers ========")
	if(!request.session.user) {
		response.json({"message": "You are not currently logged in"})
	}else{
		var sql = "SELECT * FROM users WHERE username='"+request.session.user+"'"
		db.search(sql, function(err, result){
			if (err) console.log(error)
			if(result[0].isadmin === 0) {
	    		response.json({"message": "You must be an admin to perform this action"})
	    		
    		}else {
    			//perform action
    			var qry = "SELECT fname, lname, ID FROM users"
    			if(typeof request.body.fname !== "undefined" && request.body.fname !== null) {
    				qry += " WHERE fname = '"+request.body.fname+"'";
        			if(typeof request.body.lname !== "undefined" && request.body.lname !== null) qry += " AND lname = '"+request.body.lname+"'";
			    } else {
        			if(typeof request.body.lname !== "undefined" && request.body.lname !== null) qry += " WHERE lname = '"+request.body.lname+"'";
			    }
			    // console.log(qry)
			    db.search(qry, (err, result)=>{
			    	if(err) console.log(err)
			    	if(result.length === 0) {
			    		response.json({"message": "There are no users that match that criteria"})
			    	}else if(result.length > 0) {
			    		var json = JSON.parse(JSON.stringify(result))
			    		response.json({"message": "The action was successful", "user":json})
			    	}
			    })
    		}
    	})
    }
})


app.post("/productsPurchased",(request, response)=>{
	console.log("======== viewUserPurchase ========")
	if(!request.session.user) {
		response.json({"message": "You are not currently logged in"})
	}else{
		var sql = "SELECT * FROM users WHERE username='"+request.session.user+"'"
		db.search(sql, function(err, result){
			if (err) console.log(error)
			if(result[0].isadmin === 0) {
	    		response.json({"message": "You must be an admin to perform this action"})
    		}else if(request.body.username === "undefined" || request.body.username === null) {
				response.json({"message": "There are no users that match that criteria"})
			}else {
    			//check if username is valid
    			var sql = "SELECT * FROM users WHERE username = '"+request.body.username+"';"
    			db.search(sql, (err, result)=>{
    				if(err) console.log(err)
    				if(result.length === 0) {
			    		response.json({"message": "There are no users that match that criteria"})
			    	}else{
			    		var userid = result[0].ID
			    		//get all order history of this user
			    		var getorder = "SELECT asin, SUM(quantity) AS quantity FROM orders WHERE userid = "+userid+
			    		" Group By asin;"
			    		db.search(getorder, (err, result) =>{
			    			if(result.length === 0) {
			    				response.json({"message": "The action was successful","products":[]})
			    			}else{
				    			// console.log(result)
				    			//based on asid, , get product name (has histpry)
				    			var quantity_ref = {}
				    			var getPname = "SELECT productName, asin FROM product WHERE asin IN ("
				    			for(var i in result) {
				    				getPname += "'"+result[i]['asin']+"',"
				    				quantity_ref[result[i]['asin']] = result[i]['quantity']
				    			}
				    			getPname = getPname.substring(0,getPname.length-1)+");"
				    			db.search(getPname, (err, rows)=>{
				    				if(err) console.log(err)
				    				var history = []
				    				for(var i in rows) {
				    					var obj = {}
				    					obj["productName"] = rows[i]["productName"]
				    					obj['quantity'] = quantity_ref[rows[i]["asin"]]
				    					history.push(obj)
				    				}
				    				response.json({"message": "The action was successful","products":history})
				    			})
			    			}
			    		})
			    	}
    			})
    		}
    	})
	}
})



module.exports = app;

