import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/events_User.html';

if(Meteor.isClient) {
	Template.events_User.helpers({
		isOwner: function() {
			return this.owner === Meteor.userId();
		},
		userEvents: function() {
			return Events.find();
			/*
			if (Session.get('done')) {
				return UserEvents.find({checked: {$ne: true}});
			} else {
				return UserEvents.find();
			}
			*/
		}
	});

	Template.events_User.events({
		'click .toggle-checked': function() {
			UserEvents.update(this._id, {$set: {
				checked: !this.checked
				}
			});
		},

		'click .delete': function() {
			Meteor.call("removeEvent", this._id);
		},

		'click .update': (e)=> {
			var id = e.target.id;
			Router.go("update-event", {_id: id});
		}
	});
}