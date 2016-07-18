var Movie = require('../models/movie')
var Category = require('../models/category')
//index page
exports.index=function(req,res){
    Category
        .find({})
        .populate({path: 'movies',options:{limit: 6}})
        .exec(
            function(err,categories){
                if(err){
                    console.log(err)
                }

                res.render('index',{
                    title:'电影首页',
                    categories:categories
                })

            })
}

//search page
exports.search=function(req,res){
    var catId = req.query.cat
    var page = req.query.p
    var count = 2
    var index = page * count
    Category
        .find({_id:catId})
        .populate({path: 'movies',select:'title poster'})
        .exec(
            function(err,categories){
                if(err){
                    console.log(err)
                }
                var category = categories[0] || {}
                var movies = category.movies || []
                var results = movies.slice(index, index+count)
                res.render('results',{
                    title:'结果列表页',
                    keyword:category.name,
                    query:catId,
                    currentPage:page+1,
                    totalPage:Math.ceil(movies.length /count),
                    movies:results
                })

            })
}
