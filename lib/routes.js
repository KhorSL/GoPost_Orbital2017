FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('HomeLayout');
  }
});

FlowRouter.route('/login', {
  name: 'login',
  action() {
    BlazeLayout.render('LoginLayout');
  }
});

FlowRouter.route('/dashboard', {
  name: 'dashboard',
  action() {
    BlazeLayout.render('DashboardLayout');
  }
});
