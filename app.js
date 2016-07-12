var express=require('express')
var path = require('path')
var port=process.env.POST || 3000
var app=express()

app.set('views', './pages')
app.set('view engine','jade')
//app.use(express.bodyParser)
app.use(express.static(path.join(__dirname,'bower_components')))
app.listen(port)

console.log('this app started on port:'+port)

//index page
app.get('/',function(req,res){
    res.render('index',{
        title:'你好，首页',
        _id:0
    })
})
// page
app.get('/detail',function(req,res){
    res.render('detail',{
        title:'你好，详情页'
    })
})
//index page
app.get('/admin',function(req,res){
    res.render('admin',{
        title:'你好，管理页'
    })
})
//index page
app.get('/admin/list',function(req,res){
    res.render('list',{
        title:'你好，列表页'
    })
})