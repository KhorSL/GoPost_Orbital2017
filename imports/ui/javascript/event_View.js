import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import '../html/event_View.html';
import '../css/event_View.css';

Template.event_View.helpers({
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
    console.log(this.owner);
	  return this.owner === Meteor.userId();
  }
 });

Template.event_View.events({
	'click #toggle-like': function(event) {
		var id = $(event.currentTarget).data( 'id' );
		Meteor.call("toggleLikes", id);
	},

  'click .delete' :function(e) {
    // confirmation to delete event
    if(!confirm("You are about to delete this event. Are you sure?")) {
      return false;
    }

    var title = $("#view_head h2").html();
    
    Meteor.call("removeEvent", this._id, function(error, result) {
      if(error) {
        console.log(error);
      } else {
        Session.set('delObj', title);
        Router.go('myEvents');
      }
    });
  },

  'click .update' :function(e) {
    var id = e.target.id;
    Router.go("update-event", {_id: id});
  },

  'click .signUp' :function(e) {
    var id = e.target.id;
    Router.go("sign-up", {_id: id});
  },

  'click .poster' :function(e) {
    e.preventDefault();
    Router.go("/dashBoard/" + e.target.id);
  },
});