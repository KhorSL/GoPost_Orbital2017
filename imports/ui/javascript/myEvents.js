import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import '../html/myEvents.html';
import '../css/dashBoard.css';
import '../css/myEvents.css';
import './events_GridView.js';
import '/imports/ui/javascript/myEvents_registrationList.js';

Template.myEvents.onCreated(function() {
  Meteor.subscribe("userEvents");
});

Template.myEvents.onDestroyed(function (){
	delete Session.keys['delObj'];
});

Template.myEvents.onRendered(function() {
  Meteor.subscribe("createdEvents");
});

Template.myEvents.events({
  'click .delete': function() {
    if(!confirm("You are about to delete this event. Are you sure?")) {
      return false;
    }

    var title = this.title;
    
    Meteor.call("removeEvent", this._id, function(error, result) {
      if(error) {
        console.log(error);
      } else {
        Session.set('delObj', title);
        Router.go('myEvents');
      }
    });
  },

  'click .update': (e)=> {
    var id = e.target.id;
    Router.go("update-event", {_id: id});
  },

  'click .signUp': (e)=> {
    // Removes all child element
    $('.submit-info').empty();

    var id = e.target.id;

    //cursor to all documents that contains id
    var q = SignUps.find({$and: [{eventId: id}, {confirmation: false}]});
    //for each cursor print first response in .submit-info
    q.forEach((post)=>{
      if(false) { //include variable to check default form or custom form
        // default form codes
      } else {
        $('.submit-info').append("<div class=\"checkbox\"><label><input type=\"checkbox\" id=\""+ post._id + "\"/>" + post.userResponseList[0].response + "</label></div>");
      }
    });
  },

  'click .accept': (e)=> {
    $('.submit-info input:checked').each(function() {
      var submissionId = $(this).attr('id');
      Meteor.call("acceptSignUp", submissionId, function(error, result) {
        if(error) {
          console.log(error.reason);
        }
      });
    });
  }
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