var express=require('express')
var path = require('path')
var port=process.env.POST || 3000
var _ = require('underscore')
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')
var Movie = require('./models/movie')
var User = require('./models/user')
var mongoose = require('mongoose')
var bodyParser= require('body-parser');
var app=express()
var dbUrl = 'mongodb://localhost/learnNode'

mongoose.connect(dbUrl)

app.set('views', 'views/pages')
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

console.log('this app started on port:'+port)

app.use(function(req,res,next){
    var _user = req.session.user
    if(_user){
        app.locals.user = _user
    }
    return next()

})
//index page
app.get('/',function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err)
        }

    res.render('index',{
        title:'电影首页',
        movies:movies,
    })
     })
})
// detail page
app.get('/movie/:id',function(req,res){
    var id = req.params.id
    Movie.findById(id,function(err,movie){
        if(err){
            console.log(err)
        }
    res.render('detail',{
        title:'电影详情页',
        movie:movie
    })
     })
})
//admin page
app.get('/admin',function(req,res){
    res.render('admin',{
        title:'后台录入页',
        movie:{
            title:'',
            doctor:'',
            country:'',
            year:'',
            poster:'',
            flash:'',
            summary:'',
            language:''
        }
    })
})
//admin update movie
app.get('/admin/update/:id',function(req,res){
  var id = req.params.id
    if(id){
        Movie.findById(id,function(err,movie){
            res.render('admin',{
                title:movie.title,
                movie:movie
            })
        })
    }
})
//data get page
app.post('/admin/movie/new', function (req, res) {
    var movieObj = req.body.movie
    var id = movieObj._id
    var _movie

    if (typeof id!== 'undefined'){
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }

                res.redirect('/movie/' + movie._id);
            });
        });
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }

            res.redirect('/movie/' + movie._id);
        });
    }
});
//list page
app.get('/admin/list',function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err)
        }
        res.render('list',{
            title:'电影列表页',
            movies:movies
        })
    })
})
//userlist page
app.get('/admin/userlist',function(req,res){
    User.fetch(function(err,users){
        if(err){
            console.log(err)
        }
        res.render('userlist',{
            title:'用户列表页',
            users:users
        })
    })
})
//list delete movie
app.delete('/admin/list',function(req,res){
    var id = req.query.id
    if(id){
        Movie.remove({_id:id},function(err,movie){
            if(err){
                console.log(err)
            }
            else{
                res.json({success:true})
            }
        })
    }
})

//signup
app.post('/user/signup',function(req,res){
   var _user = req.body.user
User.findOne({name:_user.name},function(err,user){
    if(err){
        console.log(err)
    }
    if(user){
        return res.redirect('/')
    }
    else{
        var user =  new User(_user)
        user.save(function(err,user){
            if(err){
                console.log(err)
            }
        })
        res.redirect('/admin/userlist')
    }
})
})

//signin
app.post('/user/signin',function(req,res){
    var _user = req.body.user
    var name = _user.name
    var password = _user.password

    User.findOne({name: name},function(err,user){
        if(err){
            console.log(err)
        }
        if(!user){
            return res.redirect('/')
        }
        user.comparePassword(password,function(err,isMatch){
            if(err){
                console.log(err)
            }
            if(isMatch){
                req.session.user = user
                console.log('password is matched')
               return res.redirect('/')
            }else{
              console.log('password is not matched')
            }
        })
    })
})

//logout
app.get('/logout',function(req,res){
    delete req.session.user
   delete app.locals.user

    res.redirect('/')
})
