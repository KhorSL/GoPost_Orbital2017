import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/myFriends.html';
import '../css/dashBoard.css';
import './users_GridView.js';

Template.myFriends.onCreated(function() {
	let template = Template.instance();

  	template.skipCount = new ReactiveVar(0);
  	template.toggle = new ReactiveVar(true); //toggle header

  	template.autorun( () => {
	    var skipCount = template.skipCount.get();
	    var toggle = template.toggle.get();
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
  	},
  	'change #custom-default': function(event) {
		event.preventDefault();

		if(event.target.checked) {
			Template.instance().skipCount.set(0);
			Template.instance().toggle.set(false);
			$('#defaultRF').hide('slow');
			$('#customRF').fadeIn('slow');
		} else {
			Template.instance().skipCount.set(0);
			Template.instance().toggle.set(true);
			$('#customRF').hide('slow');
			$('#defaultRF').fadeIn('slow');
		}
	}
});

Template.myFriends.helpers({
	subscriptions: function() {
		var skipCount = Template.instance().skipCount.get();
		var sub_list = Users.find({"User": Meteor.userId()}).fetch().map(function (obj) {return obj.FollowingList;});
		sub_list = _.flatten(sub_list);
		Session.set("max",sub_list.length);
		return Users.find({"User": {"$in" : sub_list}},{
			limit: 6,
      		skip: skipCount
		});
	},
	subscribers: function() {
	    var skipCount = Template.instance().skipCount.get();

	    var subscribers = Users.find({"FollowingList": Meteor.userId()}, {
	      limit: 6,
	      skip: skipCount
	    });
	    Session.set("max",subscribers.count());
	    return subscribers;
  	},
  	toggleHeader: function() {
  		return Template.instance().toggle.get();
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