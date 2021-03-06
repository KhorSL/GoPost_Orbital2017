import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/user_StickyView.html';
import '../css/bulletinBoard.css';

Template.user_StickyView.helpers({
  isUser: function(){
      if (this.User === Meteor.userId()){ //User visiting his own profile
          return true;
      } else {
        return false;
      }
    },
    hasSubscribed: function() {
      var currFollowers = Users.find({"User":Meteor.userId()}).fetch().map(function (obj) {return obj.FollowingList;});
      if(currFollowers.length > 0) {
          currFollowers = _.flatten(currFollowers);
          var lookingForUser = this.User;
          var q = _.find(currFollowers, function(id){return id===lookingForUser});
          if(q === this.User) {
             return true;
          }
      } 

      return false;
    }
});

Template.user_StickyView.events({
  'click #subscribe':function(e){
    e.preventDefault();
    var id = this.User;

    Meteor.call("subscribe",id, function(error) {
      if(error) {
        console.log(error.reason);
      }
    });
  },

  'click #unsubscribe':function(e){
    e.preventDefault();
    var id = this.User;
    
    Meteor.call("unsubscribe",id, function(error) {
      if(error) {
        console.log(error.reason);
      }
    });
  },
  
  'click .profileClick' :function(e) {
    e.preventDefault();
    Router.go("/dashBoard/" + e.currentTarget.id);
  }
});