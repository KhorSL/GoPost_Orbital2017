Router.route('/', function () {
  this.render('landing');
});

Router.route('/homepage', function () {
  this.render('homepage');
});

Router.route('/create-event', function () {
  this.render('eventform');
});

