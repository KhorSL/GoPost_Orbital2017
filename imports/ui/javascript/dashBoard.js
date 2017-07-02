import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/dashBoard.html';
import '../css/dashBoard.css';

Template.dashBoard.onCreated(() => {
  console.log(Router.current().params.owner);
  if (Router.current().params.owner === Meteor.userId() || Router.current().params.owner === undefined){ //User visiting his own profile
    Meteor.subscribe('userDetails_Cur', Meteor.userId());
  } else {
    Meteor.subscribe('userDetails_Cur',Router.current().params.owner);
    Meteor.subscribe('userDetails_Cur',Meteor.userId()); //Subscribe to both documents so that can do subscriptions
  }

});

Template.dashBoard.helpers({
  isUser: function(){
    if (Router.current().params.owner === Meteor.userId() || Router.current().params.owner === undefined){ //User visiting his own profile
      return true;
    } else {
      return false;
    }
  },

  hasSubscribed: function(){
    //var currFollowers = this.FollowingList;
    var currFollowers = Users.find({User: Meteor.userId()}).fetch()[0].FollowingList; //Is this the right way?
  	var q = _.find(currFollowers, (x) => x == Router.current().params.owner);
  	if(q == Router.current().params.owner) {
      console.log("true");
  		return true;
  	} else {
      console.log("false");
  		return false;
  	}
  },
  username: function(){
    return Meteor.user().username; //How to get the username if  the user is not the same user? Put username in userDetails?
  },

  /*
  gender: function(){
    return Users.find({User:Meteor.userId()}).fetch()[0].Gender;
  } */

});

Template.dashBoard.events({
  'click #subscribe':function(){
    var id = Router.current().params.owner;
    Meteor.call("toggleSubscription",id);
    console.log("Clicked!");
  },

  'click .email' : function(){

  }
});
