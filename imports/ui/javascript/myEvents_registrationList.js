import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '/imports/ui/html/components/myEvents_registrationList.html';
import '../css/dashBoard.css';
import '/imports/ui/css/myEvents_registrationList.css';

Template.myEvents_registrationList.onRendered(function() {
	Meteor.subscribe('events');
});

Template.myEvents_registrationList.helpers({
	participantUser: function() {
		var participantId = this.participantId;
		var currUser = Users.findOne({User: participantId});
		var currUsername = currUser.Username;
		return currUsername;
	},

	countEvents: function() {
		var count = 0;
		this.forEach(function(post) {
			count++;
		});
		return count;
	},

	participantDp: function() {
		var participantId = this.participantId;
		var currUser = Users.findOne({User: participantId});
		var currUserDp = currUser.profilePic;
		return currUserDp;
	},

	participantGender: function() {
		var participantId = this.participantId;
		var currUser = Users.findOne({User: participantId});
		var currUserGender = currUser.Gender;
		return currUserGender;
	},

	participantAge: function() {
		var participantId = this.participantId;
		var currUser = Users.findOne({User: participantId});
		var currUserAge = currUser.Age;
		return currUserAge;
	}
});

Template.myEvents_registrationList.events({
	'change #select-all': function(e) {
		e.preventDefault();
		var check = e.target.checked;
		if(check) {
			$('.participant').prop('checked', true);
		} else {
			$('.participant').prop('checked', false);
		}
		//$('.participant').prop('checked', !$('.participant').prop('checked'));
	},

	'change :checkbox': function(e) {
		e.preventDefault();
		var numChecked = $('.participant').filter(':checked').length;
		$('#count-checkboxes').text(numChecked);
	},

	'click #to_profile': function(e) {
		e.preventDefault();
		var participantId = this.participantId;
		window.open(Router.url("dashBoard", {owner: participantId}));
	},

	'mouseover #to_profile': function(e) {
		e.preventDefault();
		//console.log("enter: " + this.participantId);
	},

	'click #accept': function(e) {
		e.preventDefault();
		$('input:checked.participant').each(function() {
			var submissionId = $(this).data('id');
			Meteor.call("acceptSignUp", submissionId, function(error, result) {
				if(error) {
					console.log(error.reason);
				}
			});
		});
	}
});
