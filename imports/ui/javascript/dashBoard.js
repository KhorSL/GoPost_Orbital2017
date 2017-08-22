import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/dashBoard.html';
import '../css/dashBoard.css';
import '../lib/croppie.min.css';
import '../lib/fullcalendar.min.css';
import './calendar_full.js';
import './dash_profilePic_modal.js';
import './dash_profileEdit_modal.js';
import './dash_passwordEdit_modal.js';

Template.dashBoard.onCreated(() => {
  /*
  if (Router.current().params.owner === Meteor.userId() || Router.current().params.owner === undefined){ //User visiting his own profile
    Meteor.subscribe('userDetails_Cur', Meteor.userId());
  } else {
    Meteor.subscribe('userDetails_Cur',Router.current().params.owner);
    Meteor.subscribe('userDetails_Cur',Meteor.userId()); //Subscribe to both documents so that can do subscriptions
  }*/

  let template = Template.instance();

  template.skipCount = new ReactiveVar(0);
  template.max = new ReactiveVar(0);
  template.max1 = new ReactiveVar(0);
  template.max2 = new ReactiveVar(0);
  template.max3 = new ReactiveVar(0);
  template.max4 = new ReactiveVar(0);
  template.max5 = new ReactiveVar(0);
  template.currentTab = new ReactiveVar(0);
  template.viewingThisOwner = new ReactiveVar(Router.current().params.owner);

  template.ownerID = new ReactiveVar(Router.current().params.owner);
  if(!Router.current().params.owner) {
    template.ownerID.set(Meteor.userId());
  }

  template.ready = new ReactiveVar();
  template.autorun( () => {
    var skipCount = template.skipCount.get();
    var ownerID = template.ownerID.get();
    var viewingThisOwner =  template.viewingThisOwner.get();

    //refreshing the page on change route manually....
    /*https://stackoverflow.com/questions/29449698/make-iron-router-reload-page-when-clicking-on-the-same-link*/
    if(Router.current().params.owner !== viewingThisOwner) {
      template.viewingThisOwner.set(Router.current().params.owner);
      document.location.reload(true);
    }

    const handle = Subsman.subscribe('events');
    template.ready.set(handle.ready());
  });
});

Template.dashBoard.helpers({
  postReady: function() {
    return Template.instance().ready.get();
  },

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
  },

  owner: function() {
    if(this.User === Meteor.userId()) {
      return true;
    } else {
      return false;
    }
  },

  sizeDependsUser: function() {
     if(this.User === Meteor.userId()) {
      return "col-lg-4";
    } else {
      return "col-lg-12";
    }
  },

  skipCount: function() {
    var max = Template.instance().max.get();
    if(max === 0) {
      return 0;
    } else {
      return (Template.instance().skipCount.get() / 3) + 1;
    }
  },

  max: function() {
    var max = 0;
    var currentTab = Template.instance().currentTab.get();
    
    if(currentTab) {
      if(currentTab === "#menu1") {
        max = Template.instance().max1.get();
      } else if(currentTab === "#menu2") {
        max = Template.instance().max2.get();
      } else if(currentTab === "#menu3") {
        max = Template.instance().max3.get();
      } else if(currentTab === "#menu4") {
        max = Template.instance().max4.get();
      } else if(currentTab === "#menu5") {
        max = Template.instance().max5.get();
      }
      Template.instance().max.set(max);
    }

    return Math.ceil(max/3);
  },
  
  userEvents: function() {
    var skipCount = Template.instance().skipCount.get();
    var owner = Template.instance().ownerID.get();

    var events_List = Events.find({"owner" : owner}, {
      sort: {createdAt: -1},
      limit: 3,
      skip: skipCount
    });
    
    Template.instance().max2.set(this.NumOfCreatedEvents);
    return events_List;
  },

  userEvents_Going: function() {
    var skipCount = Template.instance().skipCount.get();
    var owner = Template.instance().ownerID.get();

    var signedups = Users.find({"User":owner}).fetch().map(function (obj) {return obj.SignUpEventList;});
    signedups = _.pluck(_.flatten(signedups), 'eventID');
    Template.instance().max1.set(signedups.length);

    return Events.find({ "_id": {"$in" : signedups}}, {
      sort: {createdAt: -1},
      limit: 3,
      skip: skipCount
    });
  },

  userEvents_Likes: function() {
    var skipCount = Template.instance().skipCount.get();
    var owner = Template.instance().ownerID.get();

    var posterIDs = Users.find({"User": owner}).map(function (obj) {return obj.LikedList;});
    posterIDs = _.flatten(posterIDs);
    Template.instance().max5.set(posterIDs.length);

    return Events.find({"_id": {"$in" : posterIDs}}, {
      sort: {createdAt: -1},
      limit: 3,
      skip: skipCount
    });
  },

  userSubscriptions: function() {
    var skipCount = Template.instance().skipCount.get();
    var owner = Template.instance().ownerID.get();

    var sub_list = Users.find({"User": owner}).fetch().map(function (obj) {return obj.FollowingList;});
    sub_list = _.flatten(sub_list);
    Template.instance().max3.set(sub_list.length);

    return Users.find({"User": {"$in" : sub_list}}, {
      limit: 3,
      skip: skipCount
    });
  },

  userSubscribers: function() {
    var skipCount = Template.instance().skipCount.get();
    var owner = Template.instance().ownerID.get();

    var subscribers = Users.find({"FollowingList": owner}, {
      limit: 3,
      skip: skipCount
    });
    Template.instance().max4.set(this.NumOfSubscribers);
    return subscribers;
  },

  disablePrev: function() {
    var skipCount = Template.instance().skipCount.get();

    if(skipCount === 0) {
      return 'disabled';
    } else {
      return "";
    }
  }, 

  disableNext: function() {
    var skipCount = Template.instance().skipCount.get();
    var max = Template.instance().max.get();

    if((skipCount+3) >= max) {
      return 'disabled';
    } else {
      return "";
    }
  }

});

Template.dashBoard.events({
  'click #subscribe':function(e){
    e.preventDefault();
    var id = Router.current().params.owner;
    Meteor.call("subscribe",id, function(error) {
      if(error) {
        console.log(error.reason);
      }
    });
  },

  'click #unsubscribe':function(e){
    e.preventDefault();
    var id = Router.current().params.owner;
    Meteor.call("unsubscribe",id, function(error) {
      if(error) {
        console.log(error.reason);
      }
    });
  },

  'click #chatbox' : function(e){
    e.preventDefault();
    Session.set("chat_Target", this);
    Router.go('chatBoard');
  },

  'click #changePic': function(e) {
    e.preventDefault();
    $('#upload-profile-pic-modal').modal('show');
    /*Credits: https://stackoverflow.com/questions/26147697/each-string-in-an-array-with-blaze-in-meteor*/
  },

  'click #editProfile': function(e) {
    e.preventDefault();
    $('#edit-profile-modal').modal('show');
    /*Credits: https://stackoverflow.com/questions/26147697/each-string-in-an-array-with-blaze-in-meteor*/
  },

  'click #changePass': function(e) {
    e.preventDefault();
    $('#edit-password-modal').modal('show');
    /*Credits: https://stackoverflow.com/questions/26147697/each-string-in-an-array-with-blaze-in-meteor*/
  },

  'click #prevPage': function(e) { 
    var skipCount = Template.instance().skipCount.get();
    if(skipCount >= 3) {
      Template.instance().skipCount.set(skipCount-3);
    }
  },
  'click #nextPage': function(e) {
    var skipCount = Template.instance().skipCount.get();
    Template.instance().skipCount.set(skipCount+3);
  },
  'click #myTabs' : function(e) {
    e.preventDefault();
    var tab = e.target.hash;
    if(tab === "#menu1" || tab == "#menu2" || tab === "#menu3" || tab === "#menu4" || tab === "#menu5") {
      Template.instance().currentTab.set(e.target.hash);
      Template.instance().skipCount.set(0);
    }
    //$('#myTabs a[href="' + e.target.hash + '"]').tab('show');
  }
});
