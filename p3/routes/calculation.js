/*
 * author: QIYANG HE
 * Description: provide calculator functionalities
 */
const express = require('express')
const app = express.Router()
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(express.json());       // to support JSON-encoded bodies

app.post('/add',(request, response) => {
	//if not logged in, no session data is kept
	console.log(request.body)
	if(!request.session.user) {
		response.json({
			message: "You are not currently logged in"
		})
	}else{
		try{
			var sumval = Number(request.body.num1)+Number(request.body.num2)

			if(Number.isNaN(sumval)) {
				throw err
			}
			console.log(sumval)
			response.json({
				message: "The action was successful",
				result: sumval
			})
		}catch(err){
			console.log("error happens")
			response.json({
				message: "The numbers you entered are not valid"
			})
		}
	}
	
})

app.post('/multiply',(request, response) => {
	//if not logged in, no session data is kept
	console.log(request.body)
	if(!request.session.user) {
		response.json({
			message: "You are not currently logged in"
		})
	}else {
		try{
		// console.log(Number(request.body.num1), request.body.num2)
			var sumval = Number(request.body.num1)*Number(request.body.num2)
			if(Number.isNaN(sumval)) {
				throw err
			}
			console.log(sumval)
			response.json({
				message: "The action was successful",
				result: sumval
			})
		}catch(err){
			console.log("error happens")
			response.json({
				message: "The numbers you entered are not valid"
			})
		}
	}
})


app.post('/divide',(request, response) => {
	//if not logged in, no session data is kept
	console.log(request.body)
	if(!request.session.user) {
		response.json({
			message: "You are not currently logged in"
		})
	}else {
		try{
		// console.log(Number(request.body.num1), request.body.num2)
			var sumval = Number(request.body.num1)/Number(request.body.num2)
			if(Number.isNaN(sumval) || Number(request.body.num2) === 0) {
				throw err
			}
			console.log(sumval)
			response.json({
				message: "The action was successful",
				result: sumval
			})
		}catch(err){
			console.log("error happens")
			response.json({
				message: "The numbers you entered are not valid"
			})
		}
	}
})


module.exports = app;

