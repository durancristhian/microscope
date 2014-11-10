Template.postSubmit.events({
	
	"submit form": function (e) {
		
		e.preventDefault();

		var post = {
			title: $(e.target).find('[name=title]').val(),
			url: $(e.target).find('[name=url]').val()
		};

		Meteor.call("postInsert", post, function (error, result) {

			if (error) {

				return throwError(error.reason);
			}

			if (result.postExists) {

				throwError("This link has already been posted.");
			}

			Router.go("postPage", {
				_id: result._id
			});
		});
	}
});