import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import '../html/myEvents.html';
import '../css/myEvents.css';

Template.myEvents.onDestroyed(function (){
	delete Session.keys['delObj'];
});

Template.myEvents.helpers({
	delObj: function() {
		return Session.get('delObj');
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