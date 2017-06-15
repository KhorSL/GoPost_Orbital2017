Router.route('/', {
	name: 'landing',
	template: 'landing'
});

Router.route('/home', {
  name: 'home',
  template: 'home',
  layoutTemplate: 'layout'
});

Router.route('/bulletinBoard', {
	name: 'bulletinBoard',
  template: 'bulletinBoard',
  layoutTemplate: 'layout'
});

Router.route('/myBoard', {
	name: 'myBoard',
  template: 'myBoard',
  layoutTemplate: 'layout'
});

Router.route('/messageBoard', {
	name: 'messageBoard',
  template: 'messageBoard',
  layoutTemplate: 'layout'
});

Router.route('/chatBoard', {
	name: 'chatBoard',
  template: 'chatBoard',
  layoutTemplate: 'layout'
});

Router.route('/dashBoard', {
	name: 'dashBoard',
  template: 'dashBoard',
  layoutTemplate: 'layout'
});

Router.route('/myEvents', {
	name: 'myEvents',
  template: 'myEvents',
  layoutTemplate: 'layout'
});

Router.route('/create-event', {
  name: "create-event",
  template: "eventForm_Create",
  layoutTemplate: "layout"
  //this.render('eventform');
});

Router.route('/update-event/:_id', {
  name: "update-event",
  template: "eventForm_Update",
  layoutTemplate: "layout",
  data: function () {
    return UserEvents.findOne({_id: this.params._id});
  },
});

Router.route('/settings', {
	name: 'settings',
  template: 'settings',
  layoutTemplate: 'layout'
});

Router.route('/loginPage', {
  name: 'login',
  template: '/loginPage'
});

Router.route('/registerPage', {
  name: 'register',
  template: '/registerPage'
});