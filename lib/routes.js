Router.route('/', {
	name: 'landing',
	template: 'landing'
});

Router.route('/home', {
  	name: 'home',
  	template: 'home',
  	layoutTemplate: 'header'
});


Router.route('/create-event', {
  name: "create-event",
  template: "eventform"
  //this.render('eventform');
});

Router.route('/bulletinBoard', {
	name: 'bulletinBoard',
  	template: 'bulletinBoard',
  	layoutTemplate: 'header'
});

Router.route('/myBoard', {
	name: 'myBoard',
  	template: 'myBoard',
  	layoutTemplate: 'header'
});

Router.route('/messageBoard', {
	name: 'messageBoard',
  	template: 'messageBoard',
  	layoutTemplate: 'header'
});

Router.route('/chatBoard', {
	name: 'chatBoard',
  	template: 'chatBoard',
  	layoutTemplate: 'header'
});

Router.route('/dashBoard', {
	name: 'dashBoard',
  	template: 'dashBoard',
  	layoutTemplate: 'header'
});

Router.route('/myEvents', {
	name: 'myEvents',
  	template: 'myEvents',
  	layoutTemplate: 'header'
});

Router.route('/settings', {
	name: 'settings',
  	template: 'settings',
  	layoutTemplate: 'header'
});