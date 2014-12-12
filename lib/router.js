Router.route('/submit', {name: 'postSubmit'});

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
	
		return {sort: {submitted: -1}, limit: this.postsLimit()};
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
		var nextPath = this.route.path({postsLimit: this.postsLimit() + this.increment});

		return {
			nextPath: hasMore ? nextPath : null,
			posts: Posts.find({}, this.findOptions()),
			ready: this.postsSub,
		};
	}
});

Router.route("postsList", {
	path: '/:postsLimit?',
	controller: PostsListController
});

Router.route("postPage", {
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

Router.route('postEdit', {
	path: '/posts/:_id/edit',
	waitOn: function() {

		return Meteor.subscribe('singlePost', this.params._id);
	},
	data: function() {

		return Posts.findOne(this.params._id);
	}
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