import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/eventForm_signUp.html';

if(Meteor.isClient) {
	Meteor.subscribe("signUps");

	Template.eventForm_signUp.onRendered(function() {
		Meteor.subscribe("rfTemplates");
	});

	Template.eventForm_signUp.events({
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
				var region = event.target.region.value;
				var postal = event.target.postal.value;
			}

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
