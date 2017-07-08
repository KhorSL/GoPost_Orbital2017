import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import '../html/myEvents.html';
import '../css/dashBoard.css';
import '../css/myEvents.css';
import './events_GridView.js';

Template.myEvents.onCreated(function() {
  Meteor.subscribe("userEvents");
});

Template.myEvents.onDestroyed(function (){
	delete Session.keys['delObj'];
});

Template.myEvents.helpers({
	delObj: function() {
		return Session.get('delObj');
	},
  userEvents: function() {
    return Events.find({"owner" : Meteor.userId()}, {sort: {createdAt: -1}});
  },

	checkValue: function(del) {
  	if(typeof del !== 'undefined') {
  		if(del) {
  			return true;
  		}
  	} else {
  		return false;
  	}
  	return false;
  }
});

Template.myEvents.events({
  'click .new_event' : function(e) {
    e.preventDefault();
    Router.go('create-event');
  },
  'click .new_channel' : function(e) {
    e.preventDefault();
    Session.set("chat_Channel", true);
    Router.go('chatBoard');
  }
});