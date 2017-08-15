import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/loader.html';
import '../html/friendBoard.html';
import '../css/bulletinBoard.css';
import './user_StickyView.js';

Template.friendBoard.onCreated(function() {
	let template = Template.instance();

	template.searchQuery = new ReactiveVar();
	template.searching   = new ReactiveVar( false );
	template.searchBut	 = new ReactiveVar( false );
	template.initial_Limit = new ReactiveVar(20);
	Session.set("limit", template.initial_Limit.get());

	template.ready = new ReactiveVar();
  	template.autorun( () => {
  		var search = template.searchQuery.get();
  		var sButton = template.searchBut.get();

  		/*template.subscribe('users_Filter', search, () => {
	      	setTimeout( () => {
	        	template.searching.set( false );
	      	}, 300 );
    	});*/
  		const handle = Subsman.subscribe('users_Filter', search);
    	Meteor.setTimeout( () => {
    		template.searching.set( false );
    	}, 300);
    	template.ready.set(handle.ready());
  	});
});

Template.friendBoard.onRendered(function() {
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

Template.friendBoard.onDestroyed(function() {
	$(window).off("scroll");
	delete Session.keys['limit'];
});

Template.friendBoard.helpers({
	postReady: function() {
		return Template.instance().ready.get();
	},
	searching: function() {
    	return Template.instance().searching.get();
  	},
  	query: function() {
    	return Template.instance().searchQuery.get();
  	},
  	users_filtered: function() {
  		var sq = Template.instance().searchQuery.get();
  		var limit = Session.get("limit");
  		var search = {};
  		if(sq) {
    		var regex = new RegExp(sq,'i');
    		search = { Username: regex };
  		} 

  		return Users.find(search, {limit: limit});
  	}
});

Template.friendBoard.events({
	'keyup #type_search': function(e, tmp) {
		if(e.keyCode === 13) {
			$("#searchBut").click();
		} else if (!e.target.value) {
			/*https://stackoverflow.com/questions/4403444/jquery-how-to-trigger-an-event-when-the-user-clear-a-textbox*/
			tmp.searchBut.set((!tmp.searchBut.get()));
			tmp.searching.set(true);
			tmp.searchQuery.set("");
			Session.set("limit", tmp.initial_Limit.get());
		}
	},
	'click #searchBut': function(e,tmp) {
		e.preventDefault();
		var searchText = $('[name=search]').val().trim();

		tmp.searchBut.set((!tmp.searchBut.get()));

		if(searchText !== '') {
			tmp.searchQuery.set(searchText);
	      	tmp.searching.set(true);
	      	Session.set("limit", tmp.initial_Limit.get());
	    }

	    if(searchText === '') {
	    	tmp.searchQuery.set(searchText);
	    	Session.set("limit", tmp.initial_Limit.get());
	    }
	}
});
