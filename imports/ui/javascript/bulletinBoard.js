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

	template.filterType  = new ReactiveVar( "Filter By" );
	template.initial_Limit = new ReactiveVar(20);
	Session.set("limit", template.initial_Limit.get());
	Session.set("searchQuery", "");
	Session.set("selected_tag", "");
	Session.set("selected_cat", "");
	Session.set("searching", false);
	Session.set("sButton", false);

	var global_search = Session.get("navbar_search");
	if(global_search !== '' && (typeof global_search) !== 'undefined') {
		if(global_search) {
			Session.set("searchQuery",global_search); 
		}
	}

  	template.autorun( () => {
  		var search = Session.get("searchQuery");  
  		var sButton = Session.get("sButton");  
  		var tag = Session.get("selected_tag");

    	template.subscribe('events_Filter', search, tag, () => {
	      	setTimeout( () => {
	        	Session.set("searching",false); 
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
	delete Session.keys['limit', 'selected_tag', 'selected_tag', 'selected_cat', 'searching', 'sButton'];
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
    	return Session.get("searching");
  	},
  	query: function() {
    	return Session.get("searchQuery"); 
  	},
  	filter: function() {
  		return Template.instance().filterType.get();
  	},
  	events_filtered: function() {

  		var sq = Session.get("searchQuery"); 
  		var filter = $('[name=search_param]').val();
  		var tag = Session.get("selected_tag");
  		var cat = Session.get("selected_cat");  
  		var limit = Session.get("limit");
  		var search = {};
  		var regex;
  		var addCat = false;

  		if (cat !== '' && (typeof cat) !== 'undefined')	{
  			addCat = true;
  		}

  		if(sq !== '' && (typeof sq) !== 'undefined') {
  			if(sq) {
	    		regex = new RegExp(sq,'i');
	    		if(addCat) {
	    			search = {
		      			$and: [
		        			{title: regex},
		        			{category: cat}
		      			]
		    		};
	    		} else {
	    			search = {
		      			$or: [
		        			{
		        				title: regex
		        			}
		      			]
		    		};
	    		}
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
		Session.set("searching", true); 
		Session.set("selected_tag", "");	 //Invalid Tag Search to make way for Filter + Search
		Session.set("selected_cat", "");	//Invalid Tag Search to make way for Filter + Search
		Session.set("searchQuery", ""); 	//For enabling full search
		$('[name=search]').val("");			//For enabling full search
		Session.set("limit", tmp.initial_Limit.get());
		Session.set("sButton", (!Session.get("sButton"))); 	//trigger reactivity
	},
	'click #latest': function(e,tmp) {
		e.preventDefault();
		var param = $('#latest').text();
		$('.input-group #search_param').val("latest");
		tmp.filterType.set(param);
		Session.set("searching", true); 
		Session.set("selected_tag", "");		//Invalid Tag Search to make way for Filter + Search
		Session.set("selected_cat", "");		//Invalid Tag Search to make way for Filter + Search
		Session.set("limit", tmp.initial_Limit.get());
		Session.set("sButton", (!Session.get("sButton"))); 	//trigger reactivity
	},
	'click #hot': function(e,tmp) {
		e.preventDefault();
		var param = $('#hot').text();
		$('.input-group #search_param').val("hot");
		tmp.filterType.set(param);
		Session.set("searching", true); 
		Session.set("selected_tag", "");		//Invalid Tag Search to make way for Filter + Search
		Session.set("selected_cat", "");		//Invalid Tag Search to make way for Filter + Search
		Session.set("limit", tmp.initial_Limit.get());
		Session.set("sButton", (!Session.get("sButton"))); 	//trigger reactivity
	},
	'click #location': function(e,tmp) {
		e.preventDefault();
		var param = $('#location').text();
		$('.input-group #search_param').val("location");
		tmp.filterType.set(param);
		Session.set("searching", true); 
		Session.set("selected_tag", "");		//Invalid Tag Search to make way for Filter + Search
		Session.set("selected_cat", "");		//Invalid Tag Search to make way for Filter + Search
		Session.set("limit", tmp.initial_Limit.get());
		Session.set("sButton", (!Session.get("sButton"))); 	//trigger reactivity
	},
	'click #soon': function(e,tmp) {
		e.preventDefault();
		var param = $('#soon').text();
		$('.input-group #search_param').val("soon");
		tmp.filterType.set(param);
		Session.set("searching", true); 
		Session.set("selected_tag", "");		//Invalid Tag Search to make way for Filter + Search
		Session.set("selected_cat", "");		//Invalid Tag Search to make way for Filter + Search
		Session.set("limit", tmp.initial_Limit.get());
		Session.set("sButton", (!Session.get("sButton"))); 	//trigger reactivity
	},
	'click #Camp': function(e,tmp) {
		e.preventDefault();
		var param = $('#Camp').text();
		$('.input-group #search_param').val("all");
		Session.set("searching", true); 
		Session.set("selected_tag", "");			//Invalid Tag Search to make way for Filter + Search
		Session.set("selected_cat", "Camp");		
		Session.set("limit", tmp.initial_Limit.get());
		Session.set("sButton", (!Session.get("sButton"))); 	//trigger reactivity
	},
	'click #CCA': function(e,tmp) {
		e.preventDefault();
		var param = $('#CCA').text();
		$('.input-group #search_param').val("all");
		tmp.filterType.set("Cat: " + param);
		Session.set("searching", true); 
		Session.set("selected_tag", "");			//Invalid Tag Search to make way for Filter + Search
		Session.set("selected_cat", "CCA");			
		Session.set("limit", tmp.initial_Limit.get());
		Session.set("sButton", (!Session.get("sButton"))); 	//trigger reactivity
	},
	'click #Community': function(e,tmp) {
		e.preventDefault();
		var param = $('#Community').text();
		$('.input-group #search_param').val("all");
		tmp.filterType.set("Cat: " + param);
		Session.set("searching", true); 
		Session.set("selected_tag", "");				//Invalid Tag Search to make way for Filter + Search
		Session.set("selected_cat", "Community");		
		Session.set("limit", tmp.initial_Limit.get());
		Session.set("sButton", (!Session.get("sButton"))); 	//trigger reactivity
	},
	'click #Competition': function(e,tmp) {
		e.preventDefault();
		var param = $('#Competition').text();
		$('.input-group #search_param').val("all");
		tmp.filterType.set("Cat: " + param);
		Session.set("searching", true); 
		Session.set("selected_tag", "");				//Invalid Tag Search to make way for Filter + Search
		Session.set("selected_cat", "Competition");		
		Session.set("limit", tmp.initial_Limit.get());
		Session.set("sButton", (!Session.get("sButton"))); 	//trigger reactivity
	},
	'click #Internship': function(e,tmp) {
		e.preventDefault();
		var param = $('#Internship').text();
		$('.input-group #search_param').val("all");
		tmp.filterType.set("Cat: " + param);
		Session.set("searching", true); 
		Session.set("selected_tag", "");				//Invalid Tag Search to make way for Filter + Search
		Session.set("selected_cat", "Internship");		
		Session.set("limit", tmp.initial_Limit.get());
		Session.set("sButton", (!Session.get("sButton"))); 	//trigger reactivity
	},
	'click #Workshop': function(e,tmp) {
		e.preventDefault();
		var param = $('#Workshop').text();
		$('.input-group #search_param').val("all");
		tmp.filterType.set("Cat: " + param);
		Session.set("searching", true); 
		Session.set("selected_tag", "");				//Invalid Tag Search to make way for Filter + Search
		Session.set("selected_cat", "Workshop");		
		Session.set("limit", tmp.initial_Limit.get());
		Session.set("sButton", (!Session.get("sButton"))); 	//trigger reactivity
	},
	'click #Others': function(e,tmp) {
		e.preventDefault();
		var param = $('#Others').text();
		$('.input-group #search_param').val("all");
		tmp.filterType.set("Cat: " + param);
		Session.set("searching", true); 
		Session.set("selected_tag", "");				//Invalid Tag Search to make way for Filter + Search
		Session.set("selected_cat", "Others");		
		Session.set("limit", tmp.initial_Limit.get());
		Session.set("sButton", (!Session.get("sButton"))); 	//trigger reactivity
	},
	'keyup #type_search': function(e, tmp) {
		if(e.keyCode === 13) {
			$("#searchBut").click();
		} else if (!e.target.value) {
			/*https://stackoverflow.com/questions/4403444/jquery-how-to-trigger-an-event-when-the-user-clear-a-textbox*/
			Session.set("sButton", (!Session.get("sButton"))); 	//trigger reactivity
			Session.set("searchQuery", "");
			Session.set("searching", true); 
			Session.set("selected_tag", "");
			Session.set("limit", tmp.initial_Limit.get());
		}
	},
	'click #searchBut': function(e, tmp) {
		e.preventDefault();
		var searchText = $('[name=search]').val().trim();

		Session.set("sButton", (!Session.get("sButton"))); 	//trigger reactivity

		if(searchText !== '') {
			Session.set("searchQuery", searchText); 
	      	Session.set("searching", true); 
	      	Session.set("selected_tag", "");		//Invalid Tag Search to make way for Filter + Search
	   	 	Session.set("limit", tmp.initial_Limit.get());
	    }

	    if(searchText === '') {
	      	Session.set("searching", true); 
	      	Session.set("selected_tag", "");		//Invalid Tag Search to make way for Filter + Search
	    	Session.set("limit", tmp.initial_Limit.get());
	    }
	}
});
