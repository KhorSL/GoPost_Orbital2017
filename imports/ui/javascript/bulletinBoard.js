import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/bulletinBoard.html';
import '../css/bulletinBoard.css';
import './events_StickyView.js';
import '../html/components/loader.html';
import '../html/components/events_ListView.html';

Template.bulletinBoard.onCreated( () => {
	let template = Template.instance();

	Session.set("searchQuery", "");			//template.searchQuery = new ReactiveVar();
  	Session.set("filterType", "Filter By"); //template.filterType  = new ReactiveVar( "Filter By" );
	Session.set("searching", false); 		//template.searching   = new ReactiveVar( false );
	Session.set("searchBut", false);		//template.searchBut	 = new ReactiveVar( false );
	//Session.set("viewToggle", false);		//template.viewToggle	 = new ReactiveVar( false );

	var global_search = Session.get("navbar_search");
	if(global_search !== '' && (typeof global_search) !== 'undefined') {
		if(global_search) {
			Session.set("searchQuery", global_search);
		}
	}

  	template.autorun( () => {

  		var search = Session.get("searchQuery");	//var search = template.searchQuery.get();
  		var filter = Session.get("filterType");		//var filter = template.filterType.get();
  		var sButton = Session.get("sButton");		//var sButton = template.searchBut.get();

    	template.subscribe('events_Filter', search, filter, sButton,  () => {
	      	setTimeout( () => {
	        	Session.set("searching", false);	//template.searching.set( false );
	      	}, 300 );
    	});
  	});
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
  		var search = {};

  		if(sq !== '' && (typeof sq) !== 'undefined') {
  			if(sq) {
	    		var regex = new RegExp(sq,'i');
	    		search = {
	      			$or: [
	        			{ title: regex }
	      			]
	    		};
	    	}
  		}	

  		if(filter === '' || (typeof filter) === 'undefined' || filter === 'all') {
  			return Events.find(search, {sort: {title: 1 }});
  		} else if(filter === 'latest') {
  			return Events.find(search, {sort: {createdAt: -1}});
  		} else if(filter === 'hot') {
  			return Events.find(search, {sort: {likes: -1}});
  		} else if(filter === 'soon') {
  			return Events.find(search, {sort: {dateTime: -1}});
  		} else if(filter === 'types') {
  			return Events.find(search); 
  			//Incomplete...Need to figure out how to sort by Category
  		}

  		return false; 
  	}
});

Template.bulletinBoard.events({
	'click #toggle-list': function(e) {
		e.preventDefault();
		Session.set("viewToggle", true);	//Template.instance().viewToggle.set(true);
		Session.set("sButton", (!Session.get("sButton")));	//Template.instance().searchBut.set(!Template.instance().searchBut.get());
	},
	'click #toggle-grid': function(e) {
		e.preventDefault();
		Session.set("viewToggle", false);	//Template.instance().viewToggle.set(false);
		Session.set("sButton", (!Session.get("sButton")));	//Template.instance().searchBut.set(!Template.instance().searchBut.get());
	},
	'click #all': function(e) {
		e.preventDefault();
		var param = $('#all').text();
		/*$('.search-panel span#search_concept').text(param);*/
		$('.input-group #search_param').val("all");
		Session.set("filterType", param); 	//Template.instance().filterType.set(param);
		Session.set("searching", true);		//Template.instance().searching.set(true);
	},
	'click #latest': function(e) {
		e.preventDefault();
		var param = $('#latest').text();
		/*$('.search-panel span#search_concept').text(param);*/
		$('.input-group #search_param').val("latest");
		Session.set("filterType", param);	//Template.instance().filterType.set(param);
		Session.set("searching", true);		//Template.instance().searching.set(true);
	},
	'click #hot': function(e) {
		e.preventDefault();
		var param = $('#hot').text();
		/*$('.search-panel span#search_concept').text(param);*/
		$('.input-group #search_param').val("hot");
		Session.set("filterType", param);	//Template.instance().filterType.set(param);
		Session.set("searching", true);		//Template.instance().searching.set(true);
	},
	'click #types': function(e) {
		e.preventDefault();
		var param = $('#types').text();
		/*$('.search-panel span#search_concept').text(param);*/
		$('.input-group #search_param').val("types");
		Session.set("filterType", param);	//Template.instance().filterType.set(param);
		Session.set("searching", true);		//Template.instance().searching.set(true);
	},
	'click #soon': function(e) {
		e.preventDefault();
		var param = $('#soon').text();
		/*$('.search-panel span#search_concept').text(param);*/
		$('.input-group #search_param').val("soon");
		Session.set("filterType", param);	//Template.instance().filterType.set(param);
		Session.set("searching", true);		//Template.instance().searching.set(true);
	},
	'click #searchBut': function(e) {
		e.preventDefault();
		var searchText = $('[name=search]').val().trim();

		Session.set("sButton", (!Session.get("sButton")));	//Template.instance().searchBut.set(!Template.instance().searchBut.get());

		if(searchText !== '') {
			Session.set("searchQuery", searchText);	//Template.instance().searchQuery.set(searchText);
	      	Session.set("searching", true);			//Template.instance().searching.set(true);
	    }

	    if(searchText === '') {
	      	Session.set("searchQuery", searchText);	//Template.instance().searchQuery.set(searchText);
	    }
	}
});