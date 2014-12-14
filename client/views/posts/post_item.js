Template.postItem.helpers({
	
	domain: function() {
		
		var a = document.createElement('a');
		a.href = this.url;
		return a.hostname;
	},
	ownPost: function () {
		
		return Meteor.userId() === this.userId;
	},
	upvotedClass: function () {

		var userId = Meteor.userId();

		if (_.include(this.upvoters, userId)) {

			return 'pure-button-disabled';
		}
	}
});

Template.postItem.events({

	'click .upvote': function (e) {

		e.preventDefault();

		Meteor.call('upvote', this._id, function (error) {

			if (error) {

				return throwError(error.reason);
			}
		});
	}
});