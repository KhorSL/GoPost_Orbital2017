import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '/imports/ui/html/components/myEvents_registrationList.html';
import '../css/dashBoard.css';
import '/imports/ui/css/myEvents_registrationList.css';

Template.myEvents_registrationList.onRendered(function() {
	Meteor.subscribe('events');
	Meteor.subscribe('signUps');
});

Template.myEvents_registrationList.helpers({
	/* data for respective sign up status */
	signUpsPending: function(id) {
		return SignUps.find({$and: [
				{eventId: id},
				{status: "pending"}
			]
		});
	},

	signUpsAccepted: function(id) {
		return SignUps.find({$and: [
				{eventId: id},
				{status: "success"}
			]
		});
	},

	signUpsRejected: function(id) {
		return SignUps.find({$and: [
				{eventId: id},
				{status: "rejected"}
			]
		});
	},
	/* End of sign up status data */

	participantUser: function() {
		var currUsername = "";
		var participantId = this.participantId;
		var currUser = Users.findOne({User: participantId});
		if(currUser != null || currUser != undefined) {
			currUsername = currUser.Username;
		}
		return currUsername;
	},

	/* Counting respective status total number of events */
	countPendingEvents: function(id) {
		var count = 0;
		var currPendings = SignUps.find({$and: [
				{eventId: id},
				{status: "pending"}
			]
		});
		currPendings.forEach(function(post) {
			count++;
		});
		return count;
	},

	countAcceptedEvents: function(id) {
		var count = 0;
		var currPendings = SignUps.find({$and: [
				{eventId: id},
				{status: "success"}
			]
		});
		currPendings.forEach(function(post) {
			count++;
		});
		return count;
	},

	countRejectedEvents: function(id) {
		var count = 0;
		var currPendings = SignUps.find({$and: [
				{eventId: id},
				{status: "rejected"}
			]
		});
		currPendings.forEach(function(post) {
			count++;
		});
		return count;
	},
	/* End of count total number of events */

	participantDp: function() {
		var currUserDp = "";
		var participantId = this.participantId;
		var currUser = Users.findOne({User: participantId});
		if(currUser != null || currUser != undefined) {
			currUserDp = currUser.profilePic;
		}
		return currUserDp;
	},

	participantGender: function() {
		var currUserGender = "";
		var participantId = this.participantId;
		var currUser = Users.findOne({User: participantId});
		if(currUser != null || currUser != undefined) {
			currUserGender = currUser.Gender;
		}
		return currUserGender;
	},

	participantAge: function() {
		var currUserAge = "";
		var participantId = this.participantId;
		var currUser = Users.findOne({User: participantId});
		if(currUser != null || currUser != undefined) {
			var currUserAge = currUser.Age;
		}
		return currUserAge;
	},

	checkOwnership: function(id) {
		var currentUser = Meteor.userId();
		var eventId = id;
		var currEvent = Events.findOne({_id: eventId});
		if(currEvent != undefined && currEvent.owner == currentUser) {
			return true;
		}
		return false;
	}
});

Template.myEvents_registrationList.events({
	/* Select All Events for respective status */
	'change #select-all-success': function(e) {
		e.preventDefault();
		var check = e.target.checked;
		if(check) {
			$('.participant-success').prop('checked', true);
		} else {
			$('.participant-success').prop('checked', false);
		}
		//$('.participant').prop('checked', !$('.participant').prop('checked'));
	},

	'change #select-all-pending': function(e) {
		e.preventDefault();
		var check = e.target.checked;
		if(check) {
			$('.participant-pending').prop('checked', true);
		} else {
			$('.participant-pending').prop('checked', false);
		}
	},

	'change #select-all-rejected': function(e) {
		e.preventDefault();
		var check = e.target.checked;
		if(check) {
			$('.participant-rejected').prop('checked', true);
		} else {
			$('.participant-rejected').prop('checked', false);
		}
	},
	/* End of select all events */

	/* Count number of checkboxes selected */
	'change :checkbox, change .participant-rejected, change #select-all-rejected': function(e) {
		e.preventDefault();
		var numChecked = $('.participant-rejected').filter(':checked').length;
		$('#count-checkboxes-rejected').text(numChecked);
	},

	'change :checkbox, change .participant-pending, change #select-all-pending': function(e) {
		e.preventDefault();
		var numChecked = $('.participant-pending').filter(':checked').length;
		$('#count-checkboxes-pending').text(numChecked);
	},

	'change :checkbox, change .participant-success, change #select-all-success': function(e) {
		e.preventDefault();
		var numChecked = $('.participant-success').filter(':checked').length;
		$('#count-checkboxes-success').text(numChecked);
	},
	/* End of count number of checkboxes selected */

	'click #to_profile': function(e) {
		e.preventDefault();
		var participantId = this.participantId;
		window.open(Router.url("dashBoard", {owner: participantId}));
	},

	/* Buttons to change the status */
	'click #accept-pending': function(e) {
		e.preventDefault();
		$('input:checked.participant-pending').each(function() {
			var submissionId = $(this).data('id');
			Meteor.call("acceptSignUp", submissionId, function(error, result) {
				if(error) {
					console.log(error.reason);
				}
			});
		});
	},

	'click #reject-pending': function(e) {
		e.preventDefault();
		$('input:checked.participant-pending').each(function() {
			var submissionId = $(this).data('id');
			if(!confirm("You are about to decline the selected registrations. Are you sure?")) {
				return false;
			}
			Meteor.call("rejectSignUp", submissionId, function(error, result) {
				if(error) {
					console.log(error.reason);
				}
			});
		});
	},

	'click #accept-rejected': function(e) {
		e.preventDefault();
		$('input:checked.participant-rejected').each(function() {
			var submissionId = $(this).data('id');
			Meteor.call("acceptSignUp", submissionId, function(error, result) {
				if(error) {
					console.log(error.reason);
				}
			});
		});
	},

	'click #reject-success': function(e) {
		e.preventDefault();
		$('input:checked.participant-success').each(function() {
			var submissionId = $(this).data('id');
			if(!confirm("You are about to decline the selected registrations. Are you sure?")) {
				return false;
			}
			Meteor.call("rejectSignUp", submissionId, function(error, result) {
				if(error) {
					console.log(error.reason);
				}
			});
		});
	}
	/* End of buttons to change the statuses*/
});
