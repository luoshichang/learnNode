var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')
var Comment = require('../app/controllers/comment')
var Category = require('../app/controllers/category')
module.exports = function(app){
app.use(function(req,res,next){
    var _user = req.session.user
        app.locals.user = _user
    next()

})
//index
    app.get('/',Index.index)
//User
    app.post('/user/signup',User.signup)
    app.post('/user/signin',User.signin)
    app.get('/logout',User.logout)
    app.get('/signin',User.showSignin)
    app.get('/signup',User.showSignup)
    app.get('/admin/userlist',User.signinRequired,User.adminRequired,User.list)

//Movie
    app.get('/movie/:id',Movie.detail)
    app.get('/admin/new',User.signinRequired,User.adminRequired,Movie.new)
    app.get('/admin/update/:id',User.signinRequired,User.adminRequired,Movie.update)
    app.post('/admin/movie',User.signinRequired,User.adminRequired,Movie.save)
    app.get('/admin/list',User.signinRequired,User.adminRequired,Movie.list)
    app.delete('/admin/list',User.signinRequired,User.adminRequired,Movie.del)


// Comment
    app.post('/user/comment',User.signinRequired,Comment.save)

//catetory
    app.get('/admin/category/new',User.signinRequired,User.adminRequired,Category.new)
    app.post('/admin/category',User.signinRequired,User.adminRequired,Category.save)
    app.get('/admin/category/list',User.signinRequired,User.adminRequired,Category.list)

//result
    app.get('/results',Index.search)
}
