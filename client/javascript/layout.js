Template.header.events({
	'click .logout': ()=> {
		Meteor.logout();
	}
});