if(Meteor.isClient) {
	Template.generalevents.helpers({
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

	Template.generalevents.events({
		'click #toggle-like': function(event) {
			var id = $(event.currentTarget).data( 'id' );
			Meteor.call("toggleLikes", id);
		}
	});
}