Template.commentSubmit.created = function() {

	Session.set('commentSubmitErrors', {});
};

Template.commentSubmit.helpers({

	errorMessage: function(field) {

		return Session.get('commentSubmitErrors')[field];
	},
	errorClass: function (field) {

		return !!Session.get('commentSubmitErrors')[field] ? 'has-error' : '';
	}
});

Template.commentSubmit.events({

	"submit form": function (e, template) {

		e.preventDefault();
		
		var $body = $(e.target).find('[name=body]');

		var comment = {
			body: $body.val(),
			postId: template.data._id
		};
		
		var errors = {};

		if (!comment.body) {

			errors.body = "The comment can't be empty";
			return Session.set('commentSubmitErrors', errors);
		}

		Meteor.call('commentInsert', comment, function (error, commentId) {
			
			if(error) {
			
				throwError(error.reason);
			} else {
			
				cleanForm($body);
			}
		});
	}
});

var cleanForm = function (commentBody) {

	commentBody.val("");
	Session.set('commentSubmitErrors', {});
}