Router.configure({

	layoutTemplate: "layout",
	loadingTemplate: "loading",
	waitOn: function () {

		return [Meteor.subscribe("notifications")];
	}
});

PostsListController = RouteController.extend({

	template: "postsList",
	increment: 3,
	postsLimit: function () {
	
		return parseInt(this.params.postsLimit) || this.increment;
	},
	findOptions: function () {
	
		return {sort: this.sort, limit: this.postsLimit()};
	},
	onBeforeAction: function() {

		this.postsSub = Meteor.subscribe('posts', this.findOptions());
		this.next();
	},
	posts: function() {

		return Posts.find({}, this.findOptions());
	},
	data: function() {
	
		var hasMore = this.posts().count() === this.postsLimit();

		return {
			nextPath: hasMore ? this.nextPath() : null,
			posts: this.posts(),
			ready: this.postsSub
		};
	}
});

NewPostsListController = PostsListController.extend({

	sort: {submitted: -1, _id: -1},
	nextPath: function () {

		return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment});
	}
});

BestPostsListController = PostsListController.extend({

	sort: {votes: -1, submitted: -1, _id: -1},
	nextPath: function	() {

		return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment});
	}
});

Router.map(function() {
	
	this.route('home', {
		path: '/',
		controller: NewPostsListController
	});

	this.route('newPosts', {
		path: '/new/:postsLimit?',
		controller: NewPostsListController
	});

	this.route('bestPosts', {
		path: '/best/:postsLimit?',
		controller: BestPostsListController
	});

	Router.route("/submit", {
		name: 'postSubmit'
	});
	
	this.route("postPage", {
		path: "/posts/:_id",
		waitOn: function () {

			return [
				Meteor.subscribe('singlePost', this.params._id),
				Meteor.subscribe('comments', this.params._id)
			];
		},
		data: function () {

			return Posts.findOne(this.params._id);
		}
	});

	this.route('postEdit', {
		path: '/posts/:_id/edit',
		waitOn: function() {

			return Meteor.subscribe('singlePost', this.params._id);
		},
		data: function() {

			return Posts.findOne(this.params._id);
		}
	});
});


var requireLogin = function (pause) {

	if(!Meteor.user()) {

		if (Meteor.loggingIn()){

			this.render(this.loadingTemplate);
		} else {

			this.render('accessDenied');
		}
	} else {

		this.next();
	}
}

Router.onBeforeAction("loading");
Router.onBeforeAction(requireLogin, {only: "postSubmit"});