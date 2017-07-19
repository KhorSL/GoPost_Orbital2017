import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import '../html/event_View.html';
import '../css/event_View.css';

Template.event_View.helpers({
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
  isOwner: function() {
	  return this.owner === Meteor.userId();
  },
  isOwner2: function() {
    /*https://stackoverflow.com/questions/29900541/how-do-i-properly-scope-nested-each-spacebars-iterators-when-using-meteor*/
    var owner = Template.parentData(1).owner;
    return owner === Meteor.userId();
  },
  hasSignUp: function() {
    var id = this._id;
    var currEvent = SignUps.findOne({$and: [
        {participantId: Meteor.userId()},
        {eventId: id}
      ]
    });

    if(currEvent == null) {
      return false;
    } else {
      return true;
    }
  },
  participants: function() {
    /*https://bootsnipp.com/snippets/featured/panel-tables-with-filter
      https://stackoverflow.com/questions/28626410/creating-a-numbered-list-for-meteor-data*/
    var eventid = this._id;
    var owner = this.owner;
    var participants_list = Users.find({"SignUpEventList.eventID": eventid}).fetch();
    participants_list = _.map(participants_list, function(user, index) {
      return {
        number: index+1,
        name: user.Username,
        age: user.Age,
        userid: user.User,
        eventid: eventid,
        owner: owner
      };
    });
    return participants_list;
  },
  status: function() {
    //This function checks the confirmation status of the registration
    return SignUps.findOne({eventId: this.eventid, participantId: this.userid});
  },
  statusTypeR: function() {
    if(this.status === "rejected") {
      return false;
    } else {
      return true;
    }
  },
  statusTypeS: function() {
    if(this.status === "success") {
      return false;
    } else {
      return true;
    }
  }
 });

Template.event_View.events({
	'click #toggle-like': function(event) {
		var id = $(event.currentTarget).data( 'id' );
		Meteor.call("toggleLikes", id);
	},

  'click .delete' :function(e) {
    // confirmation to delete event
    if(!confirm("You are about to delete this event. Are you sure?")) {
      return false;
    }

    var title = $("#view_head h2").html();
    
    Meteor.call("removeEvent", this._id, function(error, result) {
      if(error) {
        console.log(error);
      } else {
        Session.set('delObj', title);
        Router.go('myEvents');
      }
    });
  },
  'click .new_channel' : function(e) {
    e.preventDefault();
    Session.set("chat_Channel", true);
    Router.go('chatBoard');
  },
  'click .update' :function(e) {
    var id = e.target.id;
    Router.go("update-event", {_id: id});
  },

  'click .signUp' :function(e) {
    var id = e.target.id;
    Router.go("sign-up", {_id: id});
  },
  'click .poster' :function(e) {
    e.preventDefault();
    Router.go("/dashBoard/" + e.target.id);
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
  'click #profileClick': function(e) {
    e.preventDefault();
    Router.go("/dashBoard/" + this.participantId);
  },
  'click #acceptUser': function(e) {
    e.preventDefault();
    var submissionId = this._id;
    Meteor.call("acceptSignUp", submissionId, function(error, result) {
      if(error) {
        console.log(error.reason);
      }
    });
  },
  'click #rejectUser': function(e) {
    e.preventDefault();
    var submissionId = this._id;
    Meteor.call("rejectSignUp", submissionId, function(error, result) {
      if(error) {
        console.log(error.reason);
      }
    });
  }
});