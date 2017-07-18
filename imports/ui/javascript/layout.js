import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/layout.html';
import '../css/layout.css';

Template.layout.events({
  	'click .logout': function(e){
        e.preventDefault();
        Meteor.logout();
        Session.clear();
        Router.go('/');
    },
   	'submit form' :function(e) {
   		e.preventDefault();
   		var searchText = $('[name=navbar_search]').val().trim();
   		Session.set("navbar_search", searchText);
      if(Router.current().route.path() === '/bulletinBoard') {
        Session.set("searchQuery", searchText);
        Session.set("sButton", (!Session.get("sButton")));
        Session.set("searching", true); 
      }
      Router.go('bulletinBoard');
   	}
});