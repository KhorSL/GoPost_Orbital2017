import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/loader.html';
import '../html/bulletinBoard.html';
import '../css/bulletinBoard.css';
import './events_StickyView.js';
import './events_ListView.js';
import './events_Tag.js';
import './advertisement.js';

Template.bulletinBoard.onCreated( () => {
	let template = Template.instance();

	template.searchQuery = new ReactiveVar();
	template.selected_tag = new ReactiveVar();
	template.selected_cat = new ReactiveVar();
 	template.filterType  = new ReactiveVar( "Filter By" );
	template.searching   = new ReactiveVar( false );
	template.sButton	 = new ReactiveVar( false );
	template.initial_Limit = new ReactiveVar(20);
	Session.set("limit", template.initial_Limit.get());

	var global_search = Session.get("navbar_search");
	if(global_search !== '' && (typeof global_search) !== 'undefined') {
		if(global_search) {
			template.searchQuery.set(global_search);
		}
	}

  	template.autorun( () => {
  		var search = template.searchQuery.get();
  		var sButton = template.sButton.get();
  		var tag = template.selected_tag.get();

    	template.subscribe('events_Filter', search, tag, () => {
	      	setTimeout( () => {
	        	template.searching.set( false );
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
      			Session.set("limit", (Session.get("limit")+15)); // when it reaches the end, add another 9 elements
      		}

      		lastScrollTop = scrollTop;
   		}
 	});
 	/*Auto Detect Scrolling Credits:
	http://www.meteorpedia.com/read/Infinite_Scrolling
	https://stackoverflow.com/questions/38739335/infinite-scrolling-with-meteor
	https://stackoverflow.com/questions/4306387/jquery-add-and-remove-window-scrollfunction
 	*/
 });

Template.bulletinBoard.onDestroyed(function() {
	$(window).off("scroll");
	delete Session.keys['limit'];
});

Template.bulletinBoard.helpers({
	viewType: function() {
		//return Template.instance().viewToggle.get();
		if(Session.get("viewToggle")) {
			return true;
		} else {
			return false;
		}
	},
	searching: function() {
    	return Template.instance().searching.get();
  	},
  	query: function() {
    	return Template.instance().searchQuery.get();
  	},
  	filter: function() {
  		return Template.instance().filterType.get();
  	},
  	events_filtered: function() {

  		var sq = Template.instance().searchQuery.get();
  		var filter = $('[name=search_param]').val();
  		var tag = Template.instance().selected_tag.get();
  		var cat = Template.instance().selected_cat.get();
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
  		} else if (cat !== '' && (typeof cat) !== 'undefined')	{
  			if(cat) {
  				search = {
	      			$or: [
	        			{ category: cat }
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
	},
	'click #toggle-grid': function(e) {
		e.preventDefault();
		Session.set("viewToggle", false);	//Template.instance().viewToggle.set(false);
	},
	'click #all': function(e,tmp) {
		e.preventDefault();
		var param = $('#all').text();
		/*$('.search-panel span#search_concept').text(param);*/
		$('.input-group #search_param').val("all");
		tmp.filterType.set(param);
		tmp.searching.set(true);
		tmp.selected_tag.set("");		//Invalid Tag Search to make way for Filter + Search
		tmp.selected_cat.set("");		//Invalid Tag Search to make way for Filter + Search
		tmp.searchQuery.set("");		//For enabling full search
		$('[name=search]').val("");		//For enabling full search
		Session.set("limit", tmp.initial_Limit.get());
		tmp.sButton.set((!tmp.sButton.get())); //trigger reactivity
	},
	'click #latest': function(e,tmp) {
		e.preventDefault();
		var param = $('#latest').text();
		$('.input-group #search_param').val("latest");
		tmp.filterType.set(param);
		tmp.searching.set(true);
		tmp.selected_tag.set("");		//Invalid Tag Search to make way for Filter + Search
		tmp.selected_cat.set("");		//Invalid Tag Search to make way for Filter + Search
		Session.set("limit", tmp.initial_Limit.get());
		tmp.sButton.set((!tmp.sButton.get())); //trigger reactivity
	},
	'click #hot': function(e,tmp) {
		e.preventDefault();
		var param = $('#hot').text();
		$('.input-group #search_param').val("hot");
		tmp.filterType.set(param);
		tmp.searching.set(true);
		tmp.selected_tag.set("");		//Invalid Tag Search to make way for Filter + Search
		tmp.selected_cat.set("");		//Invalid Tag Search to make way for Filter + Search
		Session.set("limit", tmp.initial_Limit.get());
		tmp.sButton.set((!tmp.sButton.get())); //trigger reactivity
	},
	'click #location': function(e,tmp) {
		e.preventDefault();
		var param = $('#location').text();
		$('.input-group #search_param').val("location");
		tmp.filterType.set(param);
		tmp.searching.set(true);
		tmp.selected_tag.set("");		//Invalid Tag Search to make way for Filter + Search
		tmp.selected_cat.set("");		//Invalid Tag Search to make way for Filter + Search
		Session.set("limit", tmp.initial_Limit.get());
		tmp.sButton.set((!tmp.sButton.get())); //trigger reactivity
	},
	'click #soon': function(e,tmp) {
		e.preventDefault();
		var param = $('#soon').text();
		$('.input-group #search_param').val("soon");
		tmp.filterType.set(param);
		tmp.searching.set(true);
		tmp.selected_tag.set("");		//Invalid Tag Search to make way for Filter + Search
		tmp.selected_cat.set("");		//Invalid Tag Search to make way for Filter + Search
		Session.set("limit", tmp.initial_Limit.get());
		tmp.sButton.set((!tmp.sButton.get())); //trigger reactivity
	},
	'click #Camp': function(e,tmp) {
		e.preventDefault();
		var param = $('#Camp').text();
		$('.input-group #search_param').val("all");
		tmp.filterType.set("Cat: " + param);
		tmp.searching.set(true);
		tmp.selected_tag.set("");			//Invalid Tag Search to make way for Filter + Search
		tmp.selected_cat.set("Camp");		
		Session.set("limit", tmp.initial_Limit.get());
		tmp.sButton.set((!tmp.sButton.get())); //trigger reactivity
	},
	'click #CCA': function(e,tmp) {
		e.preventDefault();
		var param = $('#CCA').text();
		$('.input-group #search_param').val("all");
		tmp.filterType.set("Cat: " + param);
		tmp.searching.set(true);
		tmp.selected_tag.set("");			//Invalid Tag Search to make way for Filter + Search
		tmp.selected_cat.set("CCA");		
		Session.set("limit", tmp.initial_Limit.get());
		tmp.sButton.set((!tmp.sButton.get())); //trigger reactivity
	},
	'click #Community': function(e,tmp) {
		e.preventDefault();
		var param = $('#Community').text();
		$('.input-group #search_param').val("all");
		tmp.filterType.set("Cat: " + param);
		tmp.searching.set(true);
		tmp.selected_tag.set("");			//Invalid Tag Search to make way for Filter + Search
		tmp.selected_cat.set("Community");		
		Session.set("limit", tmp.initial_Limit.get());
		tmp.sButton.set((!tmp.sButton.get())); //trigger reactivity
	},
	'click #Competition': function(e,tmp) {
		e.preventDefault();
		var param = $('#Competition').text();
		$('.input-group #search_param').val("all");
		tmp.filterType.set("Cat: " + param);
		tmp.searching.set(true);
		tmp.selected_tag.set("");			//Invalid Tag Search to make way for Filter + Search
		tmp.selected_cat.set("Competition");		
		Session.set("limit", tmp.initial_Limit.get());
		tmp.sButton.set((!tmp.sButton.get())); //trigger reactivity
	},
	'click #Internship': function(e,tmp) {
		e.preventDefault();
		var param = $('#Internship').text();
		$('.input-group #search_param').val("all");
		tmp.filterType.set("Cat: " + param);
		tmp.searching.set(true);
		tmp.selected_tag.set("");			//Invalid Tag Search to make way for Filter + Search
		tmp.selected_cat.set("Internship");		
		Session.set("limit", tmp.initial_Limit.get());
		tmp.sButton.set((!tmp.sButton.get())); //trigger reactivity
	},
	'click #Workshop': function(e,tmp) {
		e.preventDefault();
		var param = $('#Workshop').text();
		$('.input-group #search_param').val("all");
		tmp.filterType.set("Cat: " + param);
		tmp.searching.set(true);
		tmp.selected_tag.set("");			//Invalid Tag Search to make way for Filter + Search
		tmp.selected_cat.set("Workshop");		
		Session.set("limit", tmp.initial_Limit.get());
		tmp.sButton.set((!tmp.sButton.get())); //trigger reactivity
	},
	'click #Others': function(e,tmp) {
		e.preventDefault();
		var param = $('#Others').text();
		$('.input-group #search_param').val("all");
		tmp.filterType.set("Cat: " + param);
		tmp.searching.set(true);
		tmp.selected_tag.set("");			//Invalid Tag Search to make way for Filter + Search
		tmp.selected_cat.set("Others");		
		Session.set("limit", tmp.initial_Limit.get());
		tmp.sButton.set((!tmp.sButton.get())); //trigger reactivity
	},
	'keyup #type_search': function(e,tmp) {
		if(e.keyCode === 13) {
			$("#searchBut").click();
		} else if (!e.target.value) {
			/*https://stackoverflow.com/questions/4403444/jquery-how-to-trigger-an-event-when-the-user-clear-a-textbox*/
			tmp.sButton.set((!tmp.sButton.get())); //trigger reactivity
			tmp.searchQuery.set("");
			tmp.searching.set(true);
			tmp.selected_tag.set("");
			Session.set("limit", tmp.initial_Limit.get());
		}
	},
	'click #searchBut': function(e,tmp) {
		e.preventDefault();
		var searchText = $('[name=search]').val().trim();

		tmp.sButton.set((!tmp.sButton.get())); //trigger reactivity

		if(searchText !== '') {
			tmp.searchQuery.set(searchText);
	      	tmp.searching.set(true);
	      	tmp.selected_tag.set("");		//Invalid Tag Search to make way for Filter + Search
	   	 	Session.set("limit", tmp.initial_Limit.get());
	    }

	    if(searchText === '') {
	      	tmp.searchQuery.set(searchText);
	      	tmp.selected_tag.set("");		//Invalid Tag Search to make way for Filter + Search
	    	Session.set("limit", tmp.initial_Limit.get());
	    }
	}
});
