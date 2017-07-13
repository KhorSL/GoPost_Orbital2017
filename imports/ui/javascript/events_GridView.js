import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/events_GridView.html';
import '../css/myEvents.css';

Template.events_GridView.helpers({
  	formatDate: function(date) {
  		return moment(date).format('Do MMM YYYY, h.mm a');
  	},
  	isOwner: function() {
		return this.owner === Meteor.userId();
	}
});

Template.events_GridView.events({
	'click #editEvent': function(e) {
		var id = this._id;
		Router.go("update-event", {_id: id});
	},
	'click #deleteEvent': function(e) {
		if(!confirm("You are about to delete this event. Are you sure?")) {
		    return false;
		}

		var id = this._id;
		var title = this.title;
		 Meteor.call("removeEvent", id , function(error, result) {
      		if(error) {
        		console.log(error.reason);
      		}
    	});
	},
	'click #eventChannel' : function(e) {
    	e.preventDefault();
    	Session.set("chat_Channel", true);
    	Router.go('chatBoard');
  	},
  	'click #registeredList': function(e) {
  		var id = this._id;
  		Router.go("registration_List", {_id: id})
  	}

});