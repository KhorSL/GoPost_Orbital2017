import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/landing.html';
import '../css/landing.css';
import './loginPage.js';
import './registerPage.js';
import './forgetPasswordPage.js';

Template.landing.onCreated(function() {
  var template = Template.instance();
  template.count = new ReactiveVar(0);

  template.autorun(function() {
    template.subscribe("events_limit", 20);
  });
});

Template.landing.events({
  'click #loginBut': function(e) {
    e.preventDefault();
    
    $('#loginModal').modal('show');
  },

  'click #logMoreBut': function(e) {
    e.preventDefault();
    
    $('#loginModal').modal('show');
  },

  'click #signUpBut': function(e) {
    e.preventDefault();
    
    $('#registerModal').modal('show');
  },

  'click #memberNo': function(e) {
    e.preventDefault();
    $('#loginModal').modal('hide');
    $('#forgetPasswordModal').modal('hide');
    $('#registerModal').modal('show');
  },

  'click #memberYes': function(e) {
    e.preventDefault();
    $('#registerModal').modal('hide');
    $('#forgetPasswordModal').modal('hide');
    $('#loginModal').modal('show');
  },

  'click #forgetPassword': function(e) {
    e.preventDefault();
    $('#loginModal').modal('hide');
    $('#registerModal').modal('hide');
    $('#forgetPasswordModal').modal('show');
  }
});

Template.landing.helpers({
  events: function() {
    var event_list = Events.find({}, {sort: {createdAt: -1}, limit: 20});
    Template.instance().count.set(event_list.count());
    return event_list;
  },
  events_top3: function() {
    return Events.find({}, {sort: {createdAt: -1}, limit: 3});
  },
  events_count: function() {
    if(Template.instance().count.get() > 15) {
      return true;
    }
    return false;
  },
  formatDate: function(date) {
    return moment(date).format('Do MMM YYYY');
  }
});

//Validation for Login / Register
$.validator.setDefaults({
  rules: {
      emailAdd: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 3
      },
      userName: {
        required: true,
      },
      emailAddr: {
        required: true,
        email: true
      },
      password1: {
        required: true,
        minlength: 3
      },
      password2: {
        required: true,
        minlength: 3,
        equalTo: "#password1"
      }
    },
    messages: {
      emailAdd: {
        required: "Please enter an email address.",
        email: "You've entered an invalid email address."
      },
      password: {
        required: "Please enter a password.",
        minlength: "Your password must be at least {0} characters."
      },
      userName: {
        required: "Please enter an username."
      },
      emailAddr: {
        required: "Please enter an email address.",
        email: "You've entered an invalid email address."
      },
      password1: {
        required: "Please enter a password.",
        minlength: "Your password must be at least {0} characters."
      },
      password2: {
        required: "Please enter a password.",
        minlength: "Your password must be at least {0} characters.",
        equalTo: "Password do not matched! Please enter again."
      }
    }
});

//End of Validation for Login / Register