import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/layout.html';
import '../css/layout.css';

Template.layout.events({
  'click .logout': function(e){
        e.preventDefault();
        Meteor.logout();
        Router.go('/');
    }
});