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
   	},
    'click #tour': function(e) {
      e.preventDefault();
      var username = Meteor.user().username;
      // Instance the tour
      var tour = new Tour({
        storage: false,
        keyboard: false,
        onEnd: function(tour) {
          $('.dropdown').on({
              "shown.bs.dropdown": function() { this.closable = true; },
              "click":             function() { this.closable = true; },
              "hide.bs.dropdown":  function() { return this.closable; }
          });    
        },
        steps: [
        {
          orphan: true,
          title: "Welcome to GoPost!",
          content: "Hello " + username + "! " + "We are excited to show you our web application. This tour will only take a minute or two and can be triggered again.",
          backdrop: true
        },
        {
          element: "#bs-example-navbar-collapse-1",
          title: "Top navigation bar",
          content: "This is the top navigation, and it will probably be your best friend in navigating around GoPost!\nYou will can access the Search Box and various options through here. Don't worry we will bring you through shortly!",
          placement: "bottom",
          backdrop: true
        },
        {
          element: "#left-options",
          title: "Drop down navigations",
          content: "This dropdown menu will bring you to different places! Go ahead, click it!",
          placement: "bottom",
          backdrop: true,
          reflex: true,
          template: "<div class='popover tour'> <div class='arrow'></div> <h3 class='popover-title'></h3> <div class='popover-content'></div> <div class='popover-navigation'> <button class='btn btn-default' data-role='prev'>« Prev</button> <span data-role='separator'>|</span> <button class='btn btn-default' data-role='next' disabled>Next »</button> <button class='btn btn-default' data-role='end'>End tour</button> </div> </div>"
        },
        {
          element: "#left-options",
          title: "Drop down navigations",
          content: "There you have it!",
          placement: "right",
          backdrop: true,
          onShow: function() {
            $('.dropdown').on({
                "shown.bs.dropdown": function() { this.closable = false; },
                "click":             function() { this.closable = true; },
                "hide.bs.dropdown":  function() { return this.closable; }
            });
          }
        },
        {
          element: "#bulletinBoard",
          title: "Bulletin Board",
          content: "This is the Bulletin Board. It has all the events posted here, and you can search for all kinds of events that you are interested in!",
          placement: "right"
        },
        {
          element: "#discoverFriends",
          title: "Discover Friends",
          content: "Who doesn't want more friends? We do!",
          placement: "right"
        },
        {
          element: "#myNotices",
          title: "My Notices",
          content: "All your likes and subscribes favourties are here!",
          placement: "right"
        },
        {
          element: "#myEvents",
          title: "My Events",
          content: "Here you can see and manage the events that you have created. You can:\n (1) Accept registrations. \n (2) Download registrations responses. \n (3) Update event and registration form details.",
          placement: "right"
        },
        {
          element: "#createEvents",
          title: "Create Events",
          content: "This is the beginning of all your exiciting events! Go create one after the tour! (:",
          placement: "right"
        },
        {
          element: "#subscriptions",
          title: "My Subscriptions",
          content: "You can see all your subscribed Event Organisers activities here.",
          placement: "right"
        },
        {
          element: "#dash",
          title: "Dashboard",
          content: "This is your personal dashboard. You update your profile picture (add one soon!) and user information there. Oh did I mention that you have a full calendar there!",
          placement: "right"
        },
        {
          element: "#chat",
          title: "Chat Board",
          content: "So you have some secrets you want to tell your friends... Or maybe you want to find out more information from the Event Organisers.",
          placement: "right"
        },
        {
          element: "#tour",
          title: "Tour",
          content: "If you need my help to guide you through the website, find me here (:",
          placement: "right"
        },
        {
          element: "#settings",
          title: "Settings",
          content: "Update and set settings here. Things like notifications settings, etc.",
          placement: "right"
        },
        {
          element: "#about",
          title: "About Us",
          content: "Find out more about GoPost! here.",
          placement: "right",
          onNext: function() {
            $('.dropdown').on({
                "shown.bs.dropdown": function() { this.closable = true; },
                "click":             function() { this.closable = true; },
                "hide.bs.dropdown":  function() { return this.closable; }
            });
          }
        },
        {
          element: "#chatBoard",
          title: "Chat Board",
          content: "This is another place you can access the Chat Board. Do take note of this area, we will inform you if you have any unread messages.",
          backdrop: true,
          placement: "bottom"
        },
        {
          element: "#user-dropdown",
          title: "User Functions",
          content: "Click it!",
          backdrop: true,
          reflex: true,
          placement: "bottom",
          template: "<div class='popover tour'> <div class='arrow'></div> <h3 class='popover-title'></h3> <div class='popover-content'></div> <div class='popover-navigation'> <button class='btn btn-default' data-role='prev'>« Prev</button> <span data-role='separator'>|</span> <button class='btn btn-default' data-role='next' disabled>Next »</button> &nbsp; <button class='btn btn-default' data-role='end'>End tour</button> </div> </div>"
        },
        {
          element: "#user-dropdown",
          title: "User Dropdown Functions",
          content: "There you have it! You can find most of this functions at the left dropdown menu.",
          placement: "right",
          backdrop: true,
          onShow: function() {
            $('.dropdown').on({
                "shown.bs.dropdown": function() { this.closable = false; },
                "click":             function() { this.closable = true; },
                "hide.bs.dropdown":  function() { return this.closable; }
            });
          }
        },
        {
          element: "#logout",
          title: "Logout",
          content: "This is an important function! Do remember to logout if you are not using your personal computer.",
          placement: "right",
          onNext: function() {
            $('.dropdown').on({
                "shown.bs.dropdown": function() { this.closable = true; },
                "click":             function() { this.closable = true; },
                "hide.bs.dropdown":  function() { return this.closable; }
            });
          }
        },
        {
          orphan: true,
          title: "End of tour",
          content: "Hope you will enjoy your stay with GoPost!",
          backdrop: true
        }
      ]});
      
      // Initialize the tour
      tour.init();
      
      // Start the tour
      tour.restart();
    }
});