Router.route('/', {
	name: 'landing',
	template: 'landing'
});

Router.configure({
	layoutTemplate: 'header'
});

Router.route('/homepage', function () {
  	this.render('homepage');
});

Router.route('/create-event', function () {
  this.render('eventform');
});

