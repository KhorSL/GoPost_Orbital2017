import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/generalEvents.html';

if(Meteor.isClient) {
	Template.generalEvents.helpers({
		isPublic: function() {
			return this.privacy !== true;
		},

		hasLiked: function() {
			var currLikers = this.likers;
			var q = _.find(currLikers, (x) => x == Meteor.userId());
			if(q == Meteor.userId()) {
				return true;
			} else {
				return false;
			}
		}
	});

	Template.generalEvents.events({
		'click #toggle-like': function(event) {
			var id = $(event.currentTarget).data( 'id' );
			Meteor.call("toggleLikes", id);
		}
	});
}