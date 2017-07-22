Router.route('/', {
	name: 'landing',
	template: 'landing',
  loadingTemplate: "loader"
});

Router.route('/aboutUs', {
  name: 'aboutUs',
  template: 'aboutUs',
  layoutTemplate: 'layout',
  loadingTemplate: "loader"
});

Router.route('/bulletinBoard', {
	name: 'bulletinBoard',
  template: 'bulletinBoard',
  layoutTemplate: 'layout',
  loadingTemplate: "loader"
});

Router.route('/friendBoard', {
  name: 'friendBoard',
  template: 'friendBoard',
  layoutTemplate: 'layout',
  loadingTemplate: "loader"
});

Router.route('/myBoard', {
	name: 'myBoard',
  template: 'myBoard',
  layoutTemplate: 'layout',
  loadingTemplate: "loader"
});

Router.route('/messageBoard', {
	name: 'messageBoard',
  template: 'messageBoard',
  layoutTemplate: 'layout',
  loadingTemplate: "loader"
});

Router.route('/chatBoard', {
	name: 'chatBoard',
  template: 'chatBoard',
  layoutTemplate: 'layout',
  loadingTemplate: "loader"
});

Router.route('/dashBoard/:owner', {
	name: 'dashBoard',
  template: 'dashBoard',
  layoutTemplate: 'layout',
  loadingTemplate: "loader",
  data: function() {
    var selection = this.params.owner;
    return Users.findOne({User: selection});
  }
});

Router.route('/dashBoard/', { //Normal Dashboard routing
	name: 'normalDashBoard',
  template: 'dashBoard',
  layoutTemplate: 'layout',
  loadingTemplate: "loader",
  data: function() {
    var selection = Meteor.userId();
    return Users.findOne({User: selection});
  }
});

Router.route('/myEvents', {
	name: 'myEvents',
  template: 'myEvents',
  layoutTemplate: 'layout',
  loadingTemplate: "loader"
});

Router.route('/regList/:_id', {
  name: 'registration_List',
  template: 'myEvents_registrationList',
  layoutTemplate: 'layout',
  loadingTemplate: "loader",
  data: function () {
    // return event id for easy access
    return this.params._id;
  },
  onBeforeAction: function () { 
    var currEvent = Events.findOne({_id: this.params._id});
    if(currEvent != null || currEvent != undefined) { 
      if(currEvent.owner != Meteor.userId()) {
        this.stop();
        this.redirect('bulletinBoard');
        return alert("Screw off");
      }
    }
    this.next();
  },
  action: function () {
    // render all templates and regions for this route
    this.render();
  }
});

/*Credits: http://meteortips.com/second-meteor-tutorial/iron-router-part-2/*/
Router.route('/event_View/:_id', {
  name: "event_View",
  template: "event_View",
  layoutTemplate: "layout",
  loadingTemplate: "loader",
  waitOn: function () {
    var selection = this.params._id;
    return Meteor.subscribe('events_ONE', selection);
  },
  data: function() {
    var selection = this.params._id;
    return Events.findOne({_id: selection});
  }
});

Router.route('/create-event', {
  name: "create-event",
  template: "eventForm_Create",
  layoutTemplate: "layout",
  loadingTemplate: "loader"
});

Router.route('/update-event/:_id', {
  name: "update-event",
  template: "eventForm_Update",
  layoutTemplate: "layout",
  loadingTemplate: "loader",
  waitOn: function () {
    return Meteor.subscribe('events');
  },
  onBeforeAction: function () {
    var currEvent = Events.findOne({_id: this.params._id});
    if(currEvent.owner != Meteor.userId()) {
      this.stop();
      this.redirect('bulletinBoard');
      return alert("Screw off");
    }
    this.next();
  },
  action: function () {
        // render all templates and regions for this route
        this.render();
    },
  data: function () {
    return Events.findOne({_id: this.params._id});
  }
});

Router.route('/update-regForm/:_id', {
  name: "update-regForm",
  template: "eventForm_RegistrationForm_Update",
  layoutTemplate: "layout",
  loadingTemplate: "loader",
  waitOn: function () {
    return Meteor.subscribe('rfTemplates');
  },
  onBeforeAction: function () {
    var currEvent = RegistrationForms.findOne({eventId: this.params._id});
    if(currEvent.owner != Meteor.userId()) {
      this.stop();
      this.redirect('bulletinBoard');
      return alert("Screw off");
    }
    this.next();
  },  
  action: function () {
        // render all templates and regions for this route
        this.render();
    },
  data: function () {
    return RegistrationForms.findOne({eventId: this.params._id});
  }
});

Router.route('/signUp/:_id', {
  name: 'sign-up',
  template: 'eventForm_signUp',
  layoutTemplate: 'layout',
  loadingTemplate: "loader",
  data: function () {
    return RegistrationForms.findOne({eventId: this.params._id});
  },
});

Router.route('/myFriends', {
  name: 'myFriends',
  template: 'myFriends',
  layoutTemplate: 'layout',
  loadingTemplate: "loader"
});

Router.route('/settings', {
	name: 'settings',
  template: 'settings',
  layoutTemplate: 'layout',
  loadingTemplate: "loader"
});

Router.route('/verify_AccPage', {
  name: 'verify_AccPage',
  template: 'verify_AccPage',
  loadingTemplate: "loader",
  onBeforeAction: function() {
    if(Meteor.user()) {
      if(Meteor.user().emails[0].verified) {
        this.redirect("bulletinBoard");
      } else {
        this.next();
      }
    } else {
      this.next();
    }
  }
});

//Prevent unauthorised access
Router.onBeforeAction(function () {
  if (!Meteor.userId() && !Meteor.loggingIn()) {
    this.redirect('landing');
    this.stop();
  } else {
    this.next();
  }
},{except: ['landing','verify_AccPage'] });