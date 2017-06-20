import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import '../html/myEvents.html';
import '../css/myEvents.css';

Meteor.subscribe("userEvents");

Template.myEvents.onDestroyed(function (){
	delete Session.keys['delObj'];
});

Template.myEvents.helpers({
	delObj: function() {
		return Session.get('delObj');
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
  	},
});