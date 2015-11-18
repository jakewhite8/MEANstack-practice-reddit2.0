
/*
//part 1
//data in controller
var app = angular.module('flapperNews', []);

app.controller('MainCtrl', ['$scope', function($scope){
	$scope.posts = [
	  {title: 'post 1', upvotes: 5},
	  {title: 'post 2', upvotes: 2},
	  {title: 'post 3', upvotes: 15},
	  {title: 'post 4', upvotes: 9},
	  {title: 'post 5', upvotes: 4}
	];
	//function used to add a post to array posts
	$scope.addPost = function(){
		//prevent user from submitting post with no title
		if(!$scope.title || $scope.title === '') { return; }
		//create new post
  		$scope.posts.push({title: $scope.title, link: $scope.link, upvotes: 0});
  		//reset input area for title and link in view
  		$scope.title = '';
  		$scope.link = '';
	};
	//function used to increase upvote value
	$scope.incrementUpvotes = function(post){
		post.upvotes += 1;
	};
}]);
//end part 1
*/

//////////////////////////////////////////////////////////////////////////////////////////
//start part 2
//move posts data to a service (provided by angular)

//adding an external module -- need to include it as dependency in app
var app = angular.module('flapperNews', ['ui.router'])

//config function to provide ui-router fuctions
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl',
			//- use resolve property of ui-router to ensure posts are loaded
			//- allows the getAll() function to be called at an appropriate 
			// 		time to load data
			//- ensuring that anytime home state is entered, all posts are 
			//		queried from backend before state actually finishes loading
			resolve: {
				postPromise: ['posts', function(posts){
					return posts.getAll();
				}]
			}
		})
	//added a comments page for each post
		.state('posts', {
			url: '/posts/{id}',
			templateUrl: '/posts.html',
			controller: 'PostsCtrl'
		});
	$urlRouterProvider.otherwise('home');
}]);

//factory to hold posts data
app.factory('posts', ['$http',function($http){
	var o = {
		posts: [
		  {title: 'post 1', upvotes: 5, 
		  		comments: [
  					{author:'jake', body: 'Testing comment 1', upvotes: 0},
  					{author:'tim', body: 'Hellow world comment', upvotes: 0}
  				]
  			},
		  {title: 'post 2', upvotes: 2, comments: []},
		  {title: 'post 3', upvotes: 15, comments: []},
		  {title: 'post 4', upvotes: 9, comments: []},
		  {title: 'post 5', upvotes: 4, comments: []}
		],
	};

	//get posts from backend
	o.getAll = function(){
		return $http.get('/posts').success(function(data){
			//creates a deep copy of the returned data
			// - variable in MainCtrl will also be updated
			angular.copy(data, o.posts);
		});
	};
	//method for creating new posts and saving them in the backend
	o.create = function(post){
		return $http.post('/posts', post).success(function(data){
			o.posts.push(data);
		});
	};

	//saving upvote action in backend
	o.upvote = function(post){
		return $http.put('/posts/' + post._id + '/upvote').success(function(data){
			post.upvotes += 1;
		});
	};
	return o;
}])


app.controller('MainCtrl', ['$scope', 'posts', function($scope, posts){
	//injecting data
	//$scope.posts = posts.jake //displays title of jake instance in object 
	//calls post service -- object is returned -- examines object area named post
	$scope.posts = posts.posts	

	$scope.addPost = function(){
		//prevent user from submitting post with no title
		if(!$scope.title || $scope.title === '') { alert('title required'); return; }
		//create new post
		//saves posts to server using create method from post service
  		posts.create({
  			title: $scope.title,
  			link: $scope.link,
  		});
  		
  		//reset input area for title and link in view
  		$scope.title = '';
  		$scope.link = '';
	};
	
	//function used to increase upvote value
	$scope.incrementUpvotes = function(post){
		post.upvote(post)
	};
}])


app.controller('PostsCtrl', ['$scope', '$stateParams', 'posts', function($scope, $stateParams, posts){
	//this vairable (posts) grabs the appropriate post from the posts service using the id from $stateParams
	//currently is not working properly - need to pass in an id that is not looking at $index
	$scope.post = posts.posts[$stateParams.id];

	$scope.addComment = function(){
		//prevenet empty comments
		if($scope.body === ''){return;}
		//create new comment
		$scope.post.comments.push({
			body: $scope.body,
			author: 'user',
			upvotes: 0
		});
		$scope.body = '';
	};
	//handles comment upvotes
	$scope.incrementUpvotes = function(comment){
		comment.upvotes += 1;
	};
}])


//end part 2

//////////////////////////////////////////////////////////////////////////////////////////
