Template.notifications.created = function () {

	Session.set('showNotifications', false);
};

Template.notifications.helpers({

	hasNotifications: function (field) {

		return Notifications.find({userId: Meteor.userId(), read: false}).count() > 0 ? 'has-notifications' : '';
	},
	notifications: function() {

		return Notifications.find({userId: Meteor.userId(), read: false});
	},
	notificationsCount: function(){

		return Notifications.find({userId: Meteor.userId(), read: false}).count();
	},
	notificationPostPath: function() {

		return Router.routes.postPage.path({_id: this.postId});
	},
	showNotifications: function (argument) {

		return Session.get('showNotifications');
	}
});

Template.notifications.events({

	'click .notification a': function () {

		Notifications.update(this._id, {$set: {read: true}});
	},
	"click .notifications-link": function () {

		Session.set('showNotifications', !(Session.get("showNotifications")));
	}
});