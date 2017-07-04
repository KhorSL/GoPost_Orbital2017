import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/eventForm_signUp.html';

if(Meteor.isClient) {
	Meteor.subscribe("signUps");
	Template.eventForm_signUp.onRendered(function() {
		Meteor.subscribe("rfTemplates");
	});

	Template.eventForm_signUp.helpers({
		// This function coheck if the curren user had submitted the form
		checkPriorSignup: function(eventId) {
			var submission = SignUps.findOne({ $and: [
				{eventId: eventId},
				{participantId: Meteor.userId()}
				]
			});

			// if submission is pending submission != null
			if(submission != null) {
				return false;
			} else {
				return true;
			}
		},

		//This function checks the confirmation status of the registration
		checkConfirmation: function(eventId) {
			var submission = SignUps.findOne({ $and: [
				{eventId: eventId},
				{participantId: Meteor.userId()},
				{confirmation: false}
				]
			});

			// if submission is pending submission != null
			if(submission != null) {
				return false;
			} else {
				submission = SignUps.findOne({ $and: [
					{eventId: eventId},
					{participantId: Meteor.userId()},
					{confirmation: true}
					]
				});

				if(submission != null) {
					return true;
				} else {
					console.log("error"); // submission should be true if not false.
				}
			}
		}
	});

	Template.eventForm_signUp.events({
		'click #withdraw': function(event) {
			event.preventDefault();
			// confirmation to witdraw from event
			if(!confirm("You are about to withdraw from this event. Are you sure?")) {
				return false;
			}

			var eventId = this.eventId;
			var submission = SignUps.findOne({ $and: [
				{eventId: eventId},
				{participantId: Meteor.userId()}
				]
			});

			var submissionId = submission._id;

			Meteor.call("withdrawSignUp", submissionId, function(error, result) {
				if(error) {
					console.log(error.reason);
				} else {
					Session.set('delObj', "registration");
  					Router.go('event_View', { _id: eventId});
				}
			});
		},

		'submit #new-signUp': function(event) {
			event.preventDefault();

			var firstName = "", lastName = "";
			var nric = "", matric="", gender="", nationality="";
			var address ="", city="", region="", postal="";
			var faculty="", major="", mobile = "", email ="", dietaryPref="", allergies="", shirtSize_123="", shirtSize_SML="", additional="";;
			var nok_rs ="", nok_firstName="", nok_lastName="", nok_mobile="";

			if(this.name) {
				var firstName = event.target.firstName.value;
				var lastName = event.target.lastName.value;
			}

			if(this.nric) { var nric = event.target.nric.value; }

			if(this.matric) { var matric = event.target.matric.value; }

			if(this.gender) { var gender = event.target.gender.value; }

			if(this.nationality) { var nationality = event.target.nationality.value; }

			if(this.address_full) {
				var address = event.target.address.value;
				var city = event.target.city.value;
				var postal = event.target.postal.value;
			}

			if(this.region) var region = event.target.region.value;

			if(this.faculty) { var faculty = event.target.faculty.value; }
			
			if(this.major) { var major = event.target.major.value; }

			if(this.contact_mobile) { var mobile = event.target.mobile.value; }
			
			if(this.contact_email) { var email = event.target.email.value; }

			if(this.dietaryPref) var dietaryPref = event.target.dietaryPref.value;
			if(this.allergies) var allergies = event.target.allergies.value;
			if(this.shirtSize_SML) var shirtSize_SML = event.target.shirtSize_SML.value;
			if(this.shirtSize_123) var shirtSize_123 = event.target.shirtSize_123.value;

			if(this.nok_info) {
				var nok_rs = event.target.nok_rs.value;
				var nok_firstName = event.target.nok_firstName.value;
				var nok_lastName = event.target.nok_lastName.value;
				var nok_mobile = event.target.nok_mobile.value;
			}
			
			if(this.additional) { var additional = event.target.additional.value; }
			
			var eventId = this.eventId;

			Meteor.call("addSignUp", eventId, firstName, lastName, nric, matric, gender, nationality, address, city, region, postal, faculty, major, mobile, email, dietaryPref, allergies, shirtSize_SML, shirtSize_123, nok_rs, nok_firstName, nok_lastName, nok_mobile, additional, function(error, result) {
				if(error) {
					console.log(error.reason);
				} else {
					Router.go('event_View', { _id: eventId});
				}
			});
			
		}
	});
}
