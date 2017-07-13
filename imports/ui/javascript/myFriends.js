import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/myFriends.html';
import '../css/dashBoard.css';
import './users_GridView.js';

Template.myFriends.onCreated(function() {
	let template = Template.instance();

  	template.skipCount = new ReactiveVar(0);

  	template.autorun( () => {
	    var skipCount = template.skipCount.get();
	    //template.subscribe("userEvents_Page", skipCount);
	    template.subscribe("user_subscriptions", Meteor.userId());
  	});
});

Template.myEvents.onDestroyed(function (){
	delete Session.keys['max'];
});

Template.myFriends.events({
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

Template.myFriends.helpers({
	subscribers: function() {
		var skipCount = Template.instance().skipCount.get();
		var sub_list = Users.find({"User": Meteor.userId()}).fetch().map(function (obj) {return obj.FollowingList;});
		sub_list = _.flatten(sub_list);
		Session.set("max",sub_list.length);
		return Users.find({"User": {"$in" : sub_list}},{
			limit: 6,
      		skip: skipCount
		});
	},
	skipCount: function() {
    	return (Template.instance().skipCount.get() / 6) + 1;
  	},
	max: function() {
    	var max = Session.get("max");
    	return Math.ceil(max/6);
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