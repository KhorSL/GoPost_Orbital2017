Router.route('/', function () {
  this.render('landing');
});

Router.route('/homepage', function () {
  this.render('homepage');
});

Router.route('/create-event', {
  name: "create-event",
  template: "eventform"
  //this.render('eventform');
});

