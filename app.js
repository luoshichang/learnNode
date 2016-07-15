var express=require('express')
var path = require('path')
var logger = require('morgan');
var port=process.env.POST || 3000

var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')
var mongoose = require('mongoose')
var bodyParser= require('body-parser');
var app=express()
var dbUrl = 'mongodb://localhost/learnNode'

mongoose.connect(dbUrl)

app.set('views', './app/views/pages')
app.use(cookieParser());
app.use(cookieSession(
    {
        secret: 'movie',
    })
)

app.set('view engine','jade')
app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.urlencoded({extended:true}))
app.locals.moment = require('moment')
app.listen(port)
require('./config/routes')(app)
console.log('this app started on port:'+port)

if ('development' === app.get('env')) {
    app.set('showStackError', true)
    app.use(logger(':method :url :status'))
    app.locals.pretty = true
    mongoose.set('debug', true)
}
