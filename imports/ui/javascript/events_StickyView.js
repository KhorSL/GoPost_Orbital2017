import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/events_StickyView.html';
import '../css/bulletinBoard.css';

/*
https://stackoverflow.com/questions/33065699/meteor-reactivevar-access-parent-tempate-from-child-template
  var parentView = Blaze.currentView.parentView.parentView;
  var parentInstance = parentView.templateInstance();
*/

Template.events_StickyView.helpers({
  isPublic: function() {
    return this.privacy !== true; //Should put it in the find above
  },
  formatDate: function(date) {
  	return moment(date).format('Do MMM YYYY, h.mm a');
  },
  hasLiked: function() {
  	var currLikers = this.likers;
  	var q = _.find(currLikers, (x) => x == Meteor.userId());
  	if(q == Meteor.userId()) {
  		return true;
  	} else {
  		return false;
  	}
  },
  hasSubscribed: function(){
    //var currFollowers = this.FollowingList;
    //var currFollowers = Users.find({User: Meteor.userId()}).fetch()[0].FollowingList; //Is this the right way?
  
    var owner = this.owner;
    var currFollowers = Users.find({"User":Meteor.userId()}).fetch().map(function (obj) {return obj.FollowingList;});
    if(currFollowers.length > 0) {
      currFollowers = _.flatten(currFollowers);
      var q = _.find(currFollowers, function(id){return id===owner});
      if(q == owner) {
        return true;
      }
    } 
    return false;
  },
  event_Liked: function() {
    return Events.findOne({_id: this._id});
    /*Non Reactive Sort with Reactive Data: 
    https://stackoverflow.com/questions/27125046/how-to-access-another-collection-by-id-in-meteor-template*/
  },
  isOwner: function() {
    if(this.owner === Meteor.userId()) {
      return true;
    } else {
      return false;
    }
  },
  //This function check if current user sign up status for the event
  regStatus: function(statusCheck) {
    var id = this._id
    var currEvent = SignUps.findOne({$and: [
        {participantId: Meteor.userId()},
        {eventId: id},
        {status: statusCheck}
      ]
    });

    if(currEvent == null) {
      return false;
    } else {
      return true;
    }
  }
});

Template.events_StickyView.events({
  'click #toggle-like': function(event) {
    var id = $(event.currentTarget).data( 'id' );
    Meteor.call("toggleLikes", id);
  },
  'click #subscribe':function(e){
    e.preventDefault();
    var id = this.owner;
    Meteor.call("subscribe",id, function(error) {
      if(error) {
        console.log(error.reason);
      }
    });
  },
  'click #unsubscribe':function(e){
    e.preventDefault();
    var id = this.owner;
    Meteor.call("unsubscribe",id, function(error) {
      if(error) {
        console.log(error.reason);
      }
    });
  },
});