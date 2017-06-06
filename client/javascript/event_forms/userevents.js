if(Meteor.isClient) {
	Template.userevents.helpers({
		isOwner: function() {
			return this.owner === Meteor.userId();
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
			Meteor.call("removeEvent", this._id);
		},

		'click .update': (e)=> {
			var id = e.target.id;
			Router.go("update-event", {_id: id});
		}
	});
}