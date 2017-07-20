import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/events_ListView.html';
import '../css/bulletinBoard.css';

Template.events_ListView.helpers({
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
  isOwner: function() {
    if(this.owner === Meteor.userId()) {
      return true;
    } else {
      return false;
    }
  },
  //This function check if current user sign up status for the event
  regStatus: function(statusCheck) {
    var id = this._id
    var currEvent = SignUps.findOne({$and: [
        {participantId: Meteor.userId()},
        {eventId: id},
        {status: statusCheck}
      ]
    });

    if(currEvent == null) {
      return false;
    } else {
      return true;
    }
  }
});