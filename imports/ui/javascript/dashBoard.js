import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/dashBoard.html';
import '../css/dashBoard.css';
<<<<<<< HEAD

Template.dashBoard.onCreated(() => {
    Meteor.subscribe("additionalUserDetails");
});

Template.dashBoard.helpers({
  isUser: function(){
    return Router.current().params.owner === Meteor.userId();
  },

  hasSubscribed: function(){
    var currFollowers = Users.find({User: Meteor.userId()}).fetch()[0].FollowingList;
  	var q = _.find(currFollowers, (x) => x == Router.current().params.owner);
  	if(q == Router.current().params.owner) {

  		return true;
  	} else {
  		return false;
  	}
  }
});

Template.dashBoard.events({
  'click #subscribe':function(){
    var id = Router.current().params.owner;
    //console.log(id);
    //alert('Clicked!');
    Meteor.call("toggleSubscription",id);
  },

  'click .email' : function(){

  }
});
=======
import '../lib/fullcalendar.css';
import './calendar_full.js';

Template.dashBoard.onCreated(function() {
	Meteor.subscribe('userDetails_Cur', Meteor.userId());
});
>>>>>>> master
