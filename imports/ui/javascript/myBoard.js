import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/myBoard.html';
import '../html/components/loader.html';
import '../css/myBoard.css';
import './events_StickyView.js';
import './events_ListView.js';

Template.myBoard.onCreated( () => {
	let template = Template.instance();

	template.searching = new ReactiveVar(false);
	template.likeSub = new ReactiveVar(false); //like = true, sub = false
	template.initial_Limit = new ReactiveVar(20);
	Session.set("limit", template.initial_Limit.get());

  	template.autorun( () => {
  		var likeSub = template.likeSub.get();

    	template.subscribe('events_Subscribers', Meteor.userId(), likeSub, () => {
	      	setTimeout( () => {
	        	template.searching.set(false);
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

Template.myBoard.onDestroyed(function() {
	$(window).off("scroll");
	delete Session.keys['limit'];
});

Template.myBoard.helpers({
	viewType: function() {
		return Session.get("viewToggle");
	},
	searching: function() {
    	return Template.instance().searching.get();
  	},
  	events_subscribed: function() {
  		var likeSub = Template.instance().likeSub.get();

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
	},
	'click #toggle-grid': function(e) {
		e.preventDefault();
		Session.set("viewToggle", false);
	},
	'click #sub_but': function(e, tmp) {
		e.preventDefault();
		tmp.searching.set(true);
		tmp.likeSub.set(false);
	},
	'click #like_but': function(e, tmp) {
		e.preventDefault();
		tmp.searching.set(true);
		tmp.likeSub.set(true);
	},
	'click .profileClick' :function(e) {
    	e.preventDefault();
    	Router.go("/dashBoard/" + e.currentTarget.id);
  	}
});