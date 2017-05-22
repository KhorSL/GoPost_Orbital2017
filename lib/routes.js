Router.route('/', function () {
  this.render('landing');
});

Router.route('/login', function () {
  var req = this.request;
  var res = this.response;
  this.render('login');
});

Router.route('/explore', function () {
  this.render('explore');
});