var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
//handles to the Post and Comment models
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

//getting data from database for '/posts' route
//return a JSON list containing all posts
// router.get('/posts', function(req, res, next){
// 	//this queries Post model for all it contains
// 	Post.find(function(err, posts){
// 		if(err){return next(err);}
// 		//send retrieved posts back to client
// 		res.json(posts);
// 	});
// });


//putting data in database
router.post('/posts', function(req, res, next){
	//create new post with body of request object
	var post = new Post(req.body);
	//save that post in database
	post.save(function(err, post){
		if(err){return next(err);}

		res.json(post);
	});
});

//creating a route for returning a single post
//returns json back to the clients
router.get('/posts/:post', function(req, res){
	//req object, due to the param function
	//now contains an individual post
	res.json(req.post);
});


//create a route for preloading post objects
//now in routes that take :post
//req.post can be referenced
router.param('post', function(req, res, next, id){
	var query = Post.findById(id);

	query.exec(function (err, post){
		if(err) {return next(err);}
		if(!post) {return next(new Error('can\'t find post'));}

		req.post = post;
		return next(); //will then go up to router.get('/posts/:post') function
	})
})

//create route to allow for upvoting
router.put('/posts/:post/upvote', function(req, res, next){
	req.post.upvote(function(err, post){
		if(err) {return next(err);}

		res.json(post);
	});
});


module.exports = router;
