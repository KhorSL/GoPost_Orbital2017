UserEvents = new Mongo.Collection('userEvents');

if(Meteor.isClient) {
	Template.eventform.helpers({
		userEvents: function() {
			if (Session.get('done')) {
				return UserEvents.find({checked: {$ne: true}});
			} else {
				return UserEvents.find();
			}
		}
	});

	Template.eventform.events({
		'submit .new-event': function(event) {
			var title = event.target.title.value;
			var description = event.target.description.value;

			UserEvents.insert({
				title: title,
				description: description,
				createdAt: new Date()
			});

			event.target.title.value = "";
			event.target.description.value = "";

			return false;
		},

		'change .hide-finished': function(event) {
			Session.set('done', event.target.checked);
		}
	});

	Template.userevents.events({
		'click .toggle-checked': function() {
			UserEvents.update(this._id, {$set: {
				checked: !this.checked
				}
			});
		},

		'click .delete': function() {
			UserEvents.remove(this._id);
		}
	});
}
