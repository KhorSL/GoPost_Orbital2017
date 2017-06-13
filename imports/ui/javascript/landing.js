import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/landing.html';
import '../css/landing.css';

Template.landing.events({
  'click #loginBut': function(e) {
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
    $('#registerModal').modal('show');
  },

  'click #memberYes': function(e) {
    e.preventDefault();
    $('#registerModal').modal('hide');
    $('#loginModal').modal('show');
  }
});

Template.landing.helpers({
  events: function() {
    return Events.find();
  }
});