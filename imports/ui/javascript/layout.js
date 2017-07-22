import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/layout.html';
import '../css/layout.css';

Template.layout.onRendered(function() {
  let template = Template.instance();
  template.subscribe('users_msg_count');
});

Template.layout.helpers({
  messageCount: function() {
    var total = 0;
    var count = 0;
    var titles = [];
    //Get all channel Counts
    Users.find({"User": Meteor.userId()}).fetch().map(function(obj) {
      if(obj.SignUpEventList.length > 0) {
        _.map(obj.SignUpEventList, function(objA){
          count+= objA.lastRead_Count;
          titles.push(objA.eventTitle);
        });
      }
      if(obj.CreatedEventList.length > 0) {
        _.map(obj.CreatedEventList, function(objA){
          count+= objA.lastRead_Count;
          titles.push(objA.eventTitle);
        });
      }
    });

    /*https://stackoverflow.com/questions/15813329/how-i-can-sum-all-the-values-of-a-property-in-a-meteor-collection*/
    MessagesCount.find({
      $or: [
        {chatID: Meteor.userId()},
        {chatID: {$in: titles}}
      ]
    }).map(function(obj) {
      total += obj.count;
    });

    total -= count;
    if(total>0) {
      return total;
    }
    return false;
  }
});

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