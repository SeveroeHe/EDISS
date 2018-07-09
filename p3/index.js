/*
* author: QIYANG HE
* Email: qiyangh AT andrew DOT cmu DOT edu
*/
const express = require('express')
const app = express()
const port = 4000
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(express.json());       // to support JSON-encoded bodies

//session control
var session = require('express-session')
app.use(session({secret:"aaaa",resave:false,saveUninitialized:true,cookie:{maxAge:15*60*1000}}))
//configuration file
const config = require('./baseConfig.json')

//populate frontend static view
const path = require('path')
const exphbs = require('express-handlebars')

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

//set up route redirection
app.use(require("./routes/auth")) //routes for authentication
app.use(require("./routes/actionAdmin")) //routes for admin actions
app.use(require("./routes/product")) //routes for products actions
// app.use(require("./routes/calculation"))


//error handling middleware, will be catched if some errors throws before it happens
app.use((err, request, response) => {
  // log the error, for now just console.log
  // console.log(err)
  response.json({
    	message: "error happens"
  })
  return
})



// initialization function for web server
app.listen(port, (err) => {
  if (err) {
    return console.log('establish node server fail', err)
  }

  console.log(`server is listening on ${port}`)
})




