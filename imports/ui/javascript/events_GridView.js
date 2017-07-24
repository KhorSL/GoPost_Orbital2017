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
	},

  regCount: function() {
    var count = 0;
    var id = this._id;
    var currEventSignUps = SignUps.find({eventId: id});
    currEventSignUps.forEach(function() {
      count++;
    });

    return count;
  },

  successfulReg: function() {
    var count = 0;
    var id = this._id;
    var currEventSignUps = SignUps.find({$and: [
        {eventId: id},
        {status: "success"}
      ]
    });
    currEventSignUps.forEach(function() {
      count++;
    });

    return count;
  },

  rejectedReg: function() {
    var count = 0;
    var id = this._id;
    var currEventSignUps = SignUps.find({$and: [
        {eventId: id},
        {status: "rejected"}
      ]
    });
    currEventSignUps.forEach(function() {
      count++;
    });

    return count;
  },

  pendingReg: function() {
    var count = 0;
    var id = this._id;
    var currEventSignUps = SignUps.find({$and: [
        {eventId: id},
        {status: "pending"}
      ]
    });
    currEventSignUps.forEach(function() {
      count++;
    });

    return count;
  },

  secret: function() {
   
  }
});

Template.events_GridView.events({
	'click #editEvent': function(e) {
		var id = this._id;
		Router.go("event_Update", {_id: id});
	},
  'click #editRegForm': function(e) {
    var id = this._id;
    Router.go("update-regForm", {_id: id});
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
  	},

    'click #download': function(e) {
      var key, validator;
      var eventId = this._id;
      var searchEvent = Events.findOne({_id: eventId});
      
      if(searchEvent.owner == Meteor.userId()) {
        validator = "passed";
      } else {
        validator = "failed";
      }

       Meteor.call("getSecretKey", validator, function(error, result) {
        if(error){
          console.log(error.reason);
        } else {
          key = result;
          Router.go("/download-data/" + eventId + "/" + key);
        }
      });
    }

});