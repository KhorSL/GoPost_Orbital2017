import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/myBoard.html';
import '../html/components/loader.html';
import '../css/myBoard.css';
import './events_StickyView.js';
import './events_ListView.js';

Template.myBoard.onCreated( () => {
	let template = Template.instance();

	var items = "L4Zr8D4ZCMWskAzeZ,Z8KzSp8TTx8EgZZYN";
  	var posters = items.split(',');
  	Session.set("posters", posters);

	Session.set("searching", false);
	Session.set("switchButton", false);
	Session.set("viewToggle", true);
	Session.set("Initial_Limit", 20);
	Session.set("limit", Session.get("Initial_Limit"));

  	template.autorun( () => {
  		var posters = Session.get("posters"); //Need to get asrray of all subscribed posters first. Have to wait for wen zong.
  		var sButton = Session.get("sButton");

    	template.subscribe('events_Subscribers', Meteor.userId(), sButton, () => {
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
  		var posters = Session.get("posters");
  		var limit = Session.get("limit");

  		var query = {};
		var postQuery = "";

		console.log(posters);

  		return Events.find(query, {sort: {title: 1 }, limit: limit}); 
  	}
});

Template.myBoard.events({
	'click #toggle-list': function(e) {
		e.preventDefault();
		Session.set("viewToggle", true);	//Template.instance().viewToggle.set(true);
		Session.set("searching", true);
		Session.set("sButton", (!Session.get("sButton")));	//Template.instance().searchBut.set(!Template.instance().searchBut.get());
	},
	'click #toggle-grid': function(e) {
		e.preventDefault();
		Session.set("viewToggle", false);	//Template.instance().viewToggle.set(false);
		Session.set("searching", true);
		Session.set("sButton", (!Session.get("sButton")));	//Template.instance().searchBut.set(!Template.instance().searchBut.get());
	}
});