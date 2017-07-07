import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/dashBoard.html';
import '../css/dashBoard.css';

Template.dashBoard.onCreated(() => {
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
    //var currFollowers = Users.find({User: Meteor.userId()}).fetch()[0].FollowingList; //Is this the right way?
    var currFollowers = Users.find({"User":Meteor.userId()}).fetch().map(function (obj) {return obj.FollowingList;});
  	if(currFollowers.length > 0) {
      currFollowers = _.flatten(currFollowers);
      var q = _.find(currFollowers, function(id){return id===Router.current().params.owner});
      if(q == Router.current().params.owner) {
        return true;
      }
    } 

  	return false;
  },

  username: function() {
    return Meteor.user().username; //How to get the username if  the user is not the same user? Put username in userDetails?
  }

});

Template.dashBoard.events({
  'click #subscribe':function(){
    var id = Router.current().params.owner;
    Meteor.call("subscribe",id, function(error) {
      if(error) {
        console.log(error.reason);
      }
    });
  },

  'click #unsubscribe':function(){
    var id = Router.current().params.owner;
    Meteor.call("unsubscribe",id, function(error) {
      if(error) {
        console.log(error.reason);
      }
    });
  },

  'click #chatbox' : function(){
    Router.go('chatBoard');
  }
});
