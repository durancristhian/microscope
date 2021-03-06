Posts = new Meteor.Collection("posts");

Posts.allow({
	
	update: ownsDocument,
	remove: ownsDocument
});

Posts.deny({
	
	update: function (userId, post, fieldNames) {
	
		return (_.without(fieldNames, 'url', 'title').length > 0);
	}
});

Posts.deny({

	update: function (userId, post, fieldNames) {

		var errors = validatePost(post);
		return errors.title || errors.url;
	}
});

Meteor.methods({

	postInsert: function (postAttributes) {

		check(Meteor.userId(), String);
		check(postAttributes, {
			title: String,
			url: String
		});

		var errors = validatePost(postAttributes);

		if (errors.title || errors.url)
			throw new Meteor.Error('invalid-post', "You must set a title and URL for your post");

		var postWithSameLink = Posts.findOne({url: postAttributes.url});
		if (postWithSameLink) {
			return {
				postExists: true,
				_id: postWithSameLink._id
			}
		}

		var user = Meteor.user();

		var post = _.extend(postAttributes, {
			userId: user._id,
			author: user.username,
			submitted: new Date(),
			commentsCount: 0,
			upvoters: [],
			votes: 0
		});

		var postId = Posts.insert(post);

		return {
			_id: postId
		};
	},

	upvote: function (postId) {

		check(this.userId, String);
		check(postId, String);

		var post = Posts.findOne(postId);

		if(!post) {

			throw new Meteor.Error("invalid", "Post not found");
		}

		if(post.userId === this.userId) {

			throw new Meteor.Error("invalid", "Come on! Do you want to vote your own post? :|");
		}

		if (_.include(post.upvoters, this.userId)) {

			throw new Meteor.Error('invalid', 'Already upvoted this post');
		}

		Posts.update(post._id, {
			$addToSet: {
				upvoters: this.userId
			},
			$inc: {
				votes: 1
			}
		});
	}
});

validatePost = function (post) {

	var errors = {};

	if (!post.title)
		errors.title = "Please fill in a headline";

	if (!post.url)
		errors.url = "Please fill in a URL";

	return errors;
}