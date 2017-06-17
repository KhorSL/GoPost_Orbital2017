import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/events_StickyView.html';

Meteor.subscribe('events');

Template.events_StickyView.helpers({
  events: function() {
    return Events.find();
  },
  isPublic: function() {
    return this.privacy !== true;
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
  }
});

Template.events_StickyView.events({
  'click #toggle-like': function(event) {
    var id = $(event.currentTarget).data( 'id' );
    Meteor.call("toggleLikes", id);
  }
});