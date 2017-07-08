import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/events_StickyView.html';
import '../css/bulletinBoard.css';

/*
https://stackoverflow.com/questions/33065699/meteor-reactivevar-access-parent-tempate-from-child-template
  var parentView = Blaze.currentView.parentView.parentView;
  var parentInstance = parentView.templateInstance();
*/

Template.events_StickyView.helpers({
  isPublic: function() {
    return this.privacy !== true; //Should put it in the find above
  },
  formatDate: function(date) {
  	return moment(date).format('Do MMM YYYY, h.mm a');
  },
  hasLiked: function() {
  	var currLikers = this.likers;
  	var q = _.find(currLikers, (x) => x == Meteor.userId());
  	if(q == Meteor.userId()) {
  		return true;
  	} else {
  		return false;
  	}
  },
  event_Liked: function() {
    return Events.findOne({_id: this._id});
    /*Non Reactive Sort with Reactive Data: 
    https://stackoverflow.com/questions/27125046/how-to-access-another-collection-by-id-in-meteor-template*/
  }
});

Template.events_StickyView.events({
  'click #toggle-like': function(event) {
    var id = $(event.currentTarget).data( 'id' );
    Meteor.call("toggleLikes", id);
  }
});