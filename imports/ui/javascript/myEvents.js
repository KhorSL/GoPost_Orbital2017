import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import '../html/myEvents.html';
import '../css/dashBoard.css';
import '../css/myEvents.css';
import './events_GridView.js';
import '/imports/ui/javascript/myEvents_registrationList.js';

Template.myEvents.onCreated(function() {
  let template = Template.instance();

  template.skipCount = new ReactiveVar(0);

  template.autorun( () => {
    var skipCount = template.skipCount.get();
    //template.subscribe("userEvents_Page", skipCount);
    template.subscribe("userEvents");
  });
});

Template.myEvents.onDestroyed(function (){
	delete Session.keys['delObj', 'max'];
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
    Router.go("event_Update", {_id: id});
  },

  'click .new_event' : function(e) {
    e.preventDefault();
    Router.go('event_Create');
  },
  'click .new_channel' : function(e) {
    e.preventDefault();
    Session.set("chat_Channel", true);
    Router.go('chatBoard');
  },
  'click #prevPage': function(e) { 
    var skipCount = Template.instance().skipCount.get();
    if(skipCount >= 6) {
      Template.instance().skipCount.set(skipCount-6);
    }
  },
  'click #nextPage': function(e) {
    var skipCount = Template.instance().skipCount.get();
    Template.instance().skipCount.set(skipCount+6);
  }
});

Template.myEvents.helpers({
	delObj: function() {
		return Session.get('delObj');
	},

  skipCount: function() {
    var max = Session.get("max");
    if(max === 0) {
      return 0;
    } else {
      return (Template.instance().skipCount.get() / 6) + 1;
    }
  },

  max: function() {
    var max =  Users.find({User: Meteor.userId()}).fetch()[0].NumOfCreatedEvents;
    Session.set("max", max);
    return Math.ceil(max/6);
  },
  
  userEvents: function() {
    var skipCount = Template.instance().skipCount.get();
    return Events.find({"owner" : Meteor.userId()}, {
      sort: {createdAt: -1},
      limit: 6,
      skip: skipCount
    });
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

  disablePrev: function() {
    var skipCount = Template.instance().skipCount.get();
    if(skipCount === 0) {
      return 'disabled';
    } else {
      return "";
    }
  }, 

  disableNext: function() {
    var skipCount = Template.instance().skipCount.get();
    var max = Session.get("max");
    if((skipCount+6) >= max) {
      return 'disabled';
    } else {
      return "";
    }
  }
});