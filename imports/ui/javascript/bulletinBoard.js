import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/bulletinBoard.html';
import '../css/bulletinBoard.css';
import './events_StickyView.js';
import './events_Tag.js';
import '../html/components/loader.html';
import '../html/components/events_ListView.html';

Template.bulletinBoard.onCreated( () => {
	let template = Template.instance();

	Session.set("searchQuery", "");			//template.searchQuery = new ReactiveVar();
  	Session.set("filterType", "Filter By"); //template.filterType  = new ReactiveVar( "Filter By" );
	Session.set("searching", false); 		//template.searching   = new ReactiveVar( false );
	Session.set("searchBut", false);		//template.searchBut	 = new ReactiveVar( false );
	//Session.set("viewToggle", false);		//template.viewToggle	 = new ReactiveVar( false );
	Session.set("Initial_Limit", 20);
	Session.set("limit", Session.get("Initial_Limit"));

	var global_search = Session.get("navbar_search");
	if(global_search !== '' && (typeof global_search) !== 'undefined') {
		if(global_search) {
			Session.set("searchQuery", global_search);
		}
	}

  	template.autorun( () => {
  		var search = Session.get("searchQuery");	//var search = template.searchQuery.get();
  		//var filter = Session.get("filterType");		//var filter = template.filterType.get();
  		var sButton = Session.get("sButton");		//var sButton = template.searchBut.get();
  		var tag = Session.get("selected_tag");

    	template.subscribe('events_Filter', search, tag, sButton, () => {
	      	setTimeout( () => {
	        	Session.set("searching", false);	//template.searching.set( false );
	      	}, 300 );
    	});
  	});
});

Template.bulletinBoard.onRendered(function() {
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


Template.bulletinBoard.helpers({
	viewType: function() {
		//return Template.instance().viewToggle.get();
		return Session.get("viewToggle");
	},
	searching: function() {
    	//return Template.instance().searching.get();
    	return Session.get("searching");
  	},
  	query: function() {
    	//return Template.instance().searchQuery.get();
    	return Session.get("searchQuery");
  	},
  	filter: function() {
  		//return Template.instance().filterType.get();
  		return Session.get("filterType");
  	},
  	events_filtered: function() {

  		var sq = Session.get("searchQuery"); 	//var sq = Template.instance().searchQuery.get();
  		var filter = $('[name=search_param]').val();
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

  		if(filter !== '' && (typeof filter) !== 'undefined') {
  			switch(filter) {
  				case 'all':
  					return Events.find(search, {sort: {title: 1 }, limit: limit});
  				case 'latest':
  					return Events.find(search, {sort: {createdAt: -1}, limit: limit});
  				case 'hot':
  					return Events.find(search, {sort: {likes: -1}, limit: limit, reactive: false});
  				case 'soon':
  					var currentDate = new Date().toISOString();
		  			if(sq !== '') {
		  				search = {title: regex, dateTime: {$gte : currentDate}}
		  			} else {
		  				search = {dateTime: {$gte : currentDate}}
		  			}	
		  			return Events.find(search, {sort: {dateTime: 1}, limit: limit});
		  		case 'location':
		  			return Events.find(search, {sort: {location: 1}, limit: limit}); 
  			}
  		} else {
  			return Events.find(search, {sort: {title: 1 }, limit: limit}); //safety hit
  		}

  		return false;
  	}
});

Template.bulletinBoard.events({
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
	'click #all': function(e) {
		e.preventDefault();
		var param = $('#all').text();
		/*$('.search-panel span#search_concept').text(param);*/
		$('.input-group #search_param').val("all");
		Session.set("filterType", param); 	//Template.instance().filterType.set(param);
		Session.set("searching", true);		//Template.instance().searching.set(true);
		Session.set("selected_tag", "");	//Invalid Tag Search to make way for Filter + Search
		Session.set("searchQuery", "");		//For enabling full search
		$('[name=search]').val("");			//For enabling full search
		Session.set("limit", Session.get("Initial_Limit"));
		Session.set("sButton", (!Session.get("sButton"))); //trigger the reactivity
	},
	'click #latest': function(e) {
		e.preventDefault();
		var param = $('#latest').text();
		/*$('.search-panel span#search_concept').text(param);*/
		$('.input-group #search_param').val("latest");
		Session.set("filterType", param);					//Template.instance().filterType.set(param);
		Session.set("searching", true);						//Template.instance().searching.set(true);
		Session.set("selected_tag", "");					//Invalid Tag Search to make way for Filter + Search
		Session.set("limit", Session.get("Initial_Limit"));
		Session.set("sButton", (!Session.get("sButton"))); //trigger the reactivity
	},
	'click #hot': function(e) {
		e.preventDefault();
		var param = $('#hot').text();
		/*$('.search-panel span#search_concept').text(param);*/
		$('.input-group #search_param').val("hot");
		Session.set("filterType", param);					//Template.instance().filterType.set(param);
		Session.set("searching", true);						//Template.instance().searching.set(true);
		Session.set("selected_tag", "");					//Invalid Tag Search to make way for Filter + Search
		Session.set("limit", Session.get("Initial_Limit"));
		Session.set("sButton", (!Session.get("sButton"))); //trigger the reactivity
	},
	'click #location': function(e) {
		e.preventDefault();
		var param = $('#location').text();
		/*$('.search-panel span#search_concept').text(param);*/
		$('.input-group #search_param').val("location");
		Session.set("filterType", param);					//Template.instance().filterType.set(param);
		Session.set("searching", true);						//Template.instance().searching.set(true);
		Session.set("selected_tag", "");					//Invalid Tag Search to make way for Filter + Search
		Session.set("limit", Session.get("Initial_Limit"));
		Session.set("sButton", (!Session.get("sButton"))); //trigger the reactivity
	},
	'click #soon': function(e) {
		e.preventDefault();
		var param = $('#soon').text();
		/*$('.search-panel span#search_concept').text(param);*/
		$('.input-group #search_param').val("soon");
		Session.set("filterType", param);					//Template.instance().filterType.set(param);
		Session.set("searching", true);						//Template.instance().searching.set(true);
		Session.set("selected_tag", "");					//Invalid Tag Search to make way for Filter + Search
		Session.set("limit", Session.get("Initial_Limit"));
		Session.set("sButton", (!Session.get("sButton"))); //trigger the reactivity
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