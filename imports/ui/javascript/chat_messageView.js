import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/chat_messageView.html';

Template.chat_messageView.helpers({
	sending: function() {
		if(this.owner === Meteor.userId()) {
			return true;
		} else {
			return false;
		}
	},
	formatDate: function(date) {
  		return moment(date).format('Do MMM YYYY, h.mm a');
  	},
  	username: function() {
  		var user =  Users.findOne({"User": this.owner}, {"Username" : 1, "_id" : 0});
  		return user.Username;
  	}
});