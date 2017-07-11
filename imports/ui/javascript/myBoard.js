import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/myBoard.html';
import '../html/components/loader.html';
import '../css/myBoard.css';
import './events_StickyView.js';
import './events_ListView.js';

Template.myBoard.onCreated( () => {
	let template = Template.instance();
	template.subscribe('userDetails_Cur', Meteor.userId());

	Session.set("searching", false);
	Session.set("switchButton", false);
	Session.set("likeSub", false); //like = true, sub = false;
	Session.set("Initial_Limit", 20);
	Session.set("limit", Session.get("Initial_Limit"));

  	template.autorun( () => {
  		var sButton = Session.get("switchButton");
  		var likeSub = Session.get("likeSub");

    	template.subscribe('events_Subscribers', Meteor.userId(), sButton, likeSub, () => {
	      	setTimeout( () => {
	        	Session.set("searching", false);
	      	}, 300 );
    	});
  	});
});

Template.myBoard.onRendered(function() {
	var lastScrollTop = 0;

  	$(window).scroll(function(event) {
    	if($(window).scrollTop() + $(window).height() > $(document).height() - 100) { // to detect scroll event
      		var scrollTop = $(this).scrollTop();

      		if(scrollTop > lastScrollTop){ // detect scroll down
        		Session.set("limit", Session.get("limit") + 15); // when it reaches the end, add another 9 elements
      		}

      		lastScrollTop = scrollTop;
   		}
 	});
 	/*Auto Detect Scrolling Credits:
	http://www.meteorpedia.com/read/Infinite_Scrolling
	https://stackoverflow.com/questions/38739335/infinite-scrolling-with-meteor
 	*/
 });


Template.myBoard.helpers({
	viewType: function() {
		return Session.get("viewToggle");
	},
	searching: function() {
    	return Session.get("searching");
  	},
  	events_subscribed: function() {
  		var likeSub = Session.get("likeSub"); 

  		if(likeSub) {
			var posterIDs = Users.find({"User": Meteor.userId()}).map(function (obj) {return obj.LikedList;});
			posterIDs = _.flatten(posterIDs);
			var posterEvents = Events.find({"_id": {"$in" : posterIDs}});
			return posterEvents;
		} else {
			var posterIDs = Users.find({"User": Meteor.userId()}).map(function (obj) {return obj.FollowingList;});
			posterIDs = _.flatten(posterIDs);
			var posterEvents = Events.find({"owner": {"$in" : posterIDs}});
			return posterEvents;
		}
		return false;
  	},
  	events_sub_User: function() {
  		var posterIDs = Users.find({"User": Meteor.userId()}).map(function (obj) {return obj.FollowingList;});
		posterIDs = _.flatten(posterIDs);
		var subUsers = Users.find({"User": {"$in" : posterIDs}}, {limit: 10});
		return subUsers;
  	}
});

Template.myBoard.events({
	'click #toggle-list': function(e) {
		e.preventDefault();
		Session.set("viewToggle", true);
		Session.set("searching", true);
		Session.set("switchButton", (!Session.get("switchButton")));	//Trigger Reactivity
	},
	'click #toggle-grid': function(e) {
		e.preventDefault();
		Session.set("viewToggle", false);
		Session.set("searching", true);
		Session.set("switchButton", (!Session.get("switchButton")));	//Trigger Reactivity
	},
	'click #sub_but': function(e) {
		e.preventDefault();
		Session.set("searching", true);
		Session.set("likeSub", false);
	},
	'click #like_but': function(e) {
		e.preventDefault();
		Session.set("searching", true);
		Session.set("likeSub", true);
	},
	'click .profileClick' :function(e) {
    	e.preventDefault();
    	Router.go("/dashBoard/" + e.currentTarget.id);
  	}
});