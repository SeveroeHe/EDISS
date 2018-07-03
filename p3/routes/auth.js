/*
 * author: QIYANG HE
 * Description: manage user login/ logout/ regist / update contact info
 */

const express = require('express')
const app = express.Router()
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(express.json());       // to support JSON-encoded bodies
const db = require('../connectDB.js')
//load configuration
// const config = require('../baseConfig.json')

//route functions
app.get('/', (request, response) => {
	response.render('home')
})


app.post("/registerUser",(request, response) =>{
	console.log("======== registerUser ========")
	if(Object.keys(request.body).length !== 9) {
		response.json({"message": "The input you provided is not valid"});
	}else {
		try{
			var obj = {}
			// console.log(request.body)
			for (var key in request.body) {
				// console.log()
				if(request.body[key] === null || request.body[key] === undefined) {
					console.log("empty field in registration")
					throw err
				}else {
					obj[key] = request.body[key]
				}
			}
			obj['isadmin'] = 0 // indicating not an admin user
			db.regist(obj, function(err, result){
				if(err) {
					response.json({"message": "The input you provided is not valid"});
				}else {
					response.json({"message": request.body.fname+" was registered successfully"});
				}
			})
		}catch(err) {
			response.json({"message": "The input you provided is not valid"});
		}
	}
})


app.post("/updateInfo", (request, response) =>{
	console.log("======== updateInfo ========")
	if(!request.session.user) {
		response.json({"message": "You are not currently logged in"})
	}else{
		if(Object.keys(request.body).length == 0) {
			//no params arepassed
			response.json({"message": "The input you provided is not valid"});
		}else{
			var fields = "";
			var new_username = request.session.user;
			for(var key in request.body) {
				if(request.body[key] === null || request.body[key] === undefined) {
					console.log("null field in registration")
					response.json({"message": "The input you provided is not valid"});
					return
				}
				fields += key+" = '"+request.body[key]+"',"
				if(key === "username"){
					new_username = request.body[key]
					console.log("possible new name: "+new_username)
				}
			}
			var sql = "UPDATE users SET "+fields.substring(0, fields.length-1)+" WHERE username = '"+ request.session.user+"'"
			console.log(sql)
			db.update(sql, (err, result)=>{
				if(err) {
					console.log("error when registering user")
					response.json({"message": "The input you provided is not valid"});
				}else {
					// console.log(result)
					request.session.user = new_username; //update session username if needed
					var sql2 = "SELECT fname FROM users WHERE username = '"+request.session.user+"'"
					db.search(sql2, (err, rows) =>{
						if(err) {console.log(err)}
						else{
							response.json({"message": rows[0].fname+ " your information was successfully updated"})
						}
					})
				}
			})			
		}
	}
})


//login function
app.post('/login', (request, response) => {
	console.log("======== login ========")
	console.log(request.body)
	var username = request.body.username;
	var password = request.body.password;
	// console.log(username,password)

	//query database
  	var sql = "SELECT * FROM users WHERE username='"+username+"' AND password='"+password+"'"
  	// console.log(sql)
  	db.search(sql, function(err, result) {
    	if (err) throw err;
    	if(result.length !== 1) {
    		response.json({"message": "There seems to be an issue with the username/password combination that you entered"})
    	}else if(result.length === 1) {

    		request.session.user = result[0].username;
    		request.session.userid = result[0].ID.toString();
    		console.log(result[0].ID.toString())
    		// response.render('logged_in', {'username': username})
    		response.json({"message": "Welcome "+result[0].fname})
    	}
  	});
})


app.post('/logout',(request, response) => {
	console.log("======== logout ========")
	if(!request.session.user) {
		response.json({"message": "You are not currently logged in"})
	}else {
		// console.log(request.session.user)
		//end session
		request.session.destroy()
		response.json({"message": "You have been successfully logged out"})
	}
})



// self login test function
app.get('/ifloggedin',(request, response) => {
	if(!request.session.user) {
		response.json({"message": "not logged in"})
	}else {
		console.log(request.session.user)
		response.json({"message": "logged in is " + request.session.user+ " "+request.session.userid})
	}

})

module.exports = app;




