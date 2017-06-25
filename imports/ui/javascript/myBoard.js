import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/myBoard.html';
import '../html/components/loader.html';
import './events_StickyView.js';
import './events_ListView.js';
import './events_Tag.js';

Template.myBoard.onCreated( () => {
	let template = Template.instance();

	Session.set("searchQuery", "");
	Session.set("searching", false);
	Session.set("searchBut", false);
	Session.set("viewToggle", true);
	Session.set("Initial_Limit", 20);
	Session.set("limit", Session.get("Initial_Limit"));

  	template.autorun( () => {
  		var search = Session.get("searchQuery");
  		var sButton = Session.get("sButton");
  		var tag = Session.get("selected_tag");

    	template.subscribe('events_Filter', search, tag, sButton, () => {
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
  	query: function() {
    	return Session.get("searchQuery");
  	},
  	events_filtered: function() {

  		var sq = Session.get("searchQuery"); 	
  		var tag = Session.get("selected_tag");
  		var limit = Session.get("limit");
  		var search = {};
  		var regex;

  		if(sq !== '' && (typeof sq) !== 'undefined') {
  			if(sq) {
	    		regex = new RegExp(sq,'i');
	    		search = {
	      			$or: [
	        			{ 
	        				title: regex 
	        			}
	      			]
	    		};
	    	}
  		} else if (tag !== '' && (typeof tag) !== 'undefined')	{
  			if(tag) {
  				search = {
	      			$or: [
	        			{ type: tag }
	      			]
	    		};
  			}
  		}

  		return Events.find(search, {sort: {title: 1 }, limit: limit}); //safety hit
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
	},
	'click #searchBut': function(e) {
		e.preventDefault();
		var searchText = $('[name=search]').val().trim();

		Session.set("sButton", (!Session.get("sButton")));	//Template.instance().searchBut.set(!Template.instance().searchBut.get());

		if(searchText !== '') {
			Session.set("searchQuery", searchText);	//Template.instance().searchQuery.set(searchText);
	      	Session.set("searching", true);			//Template.instance().searching.set(true);
	      	Session.set("selected_tag", "");		//Invalid Tag Search to make way for Filter + Search
	   	 	Session.set("limit", Session.get("Initial_Limit"));
	    }

	    if(searchText === '') {
	      	Session.set("searchQuery", searchText);	//Template.instance().searchQuery.set(searchText);
	      	Session.set("selected_tag", "");		//Invalid Tag Search to make way for Filter + Search
	    	Session.set("limit", Session.get("Initial_Limit"));
	    }
	}
});