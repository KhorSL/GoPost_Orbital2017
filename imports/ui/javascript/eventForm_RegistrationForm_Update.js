import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/eventForm_RegistrationForm_Update.html';
import '/imports/ui/html/components/eventForm_RegistrationForm_Update_Custom.html';
import '/imports/ui/html/components/eventForm_RegistrationForm_Update_Default.html';

Template.eventForm_RegistrationForm_Update.helpers({
	eq: function (v1, v2) {
        return v1 === v2;
    },
    ne: function (v1, v2) {
        return v1 !== v2;
    },
    lt: function (v1, v2) {
        return v1 < v2;
    },
    gt: function (v1, v2) {
        return v1 > v2;
    },
    lte: function (v1, v2) {
        return v1 <= v2;
    },
    gte: function (v1, v2) {
        return v1 >= v2;
    },
    and: function (v1, v2) {
        return v1 && v2;
    },
    or: function (v1, v2) {
        return v1 || v2;
    }
});

Template.eventForm_RegistrationForm_Update_Custom.helpers({
	checkFieldType: function(type) {
		if(type == this.type) {
			return true;
		} else {
			return false;
		}
	},

	showOptions: function() {
		var str = "";
		var count = 0;
		this.options.forEach(function(post) {
			if(count == 0) {
				str = str.concat(post);
			} else {
				str = str.concat("," + post);
			}
			count++;
		});
		return str;
	}
});

Template.eventForm_RegistrationForm_Update_Custom.onRendered(function() {
		//Limiting the number of question user can add
		maxFields = 25;
		currFields = 0;
});

Template.eventForm_RegistrationForm_Update_Custom.events({
	'submit #update-regForm': function(event) {
		event.preventDefault();

		var customQns = [];
		$('.qnswrapper').each(function() {
				var qnsObj = {name: "", type: "", options: []}; //create a new object that stores name, type and options(if required)
				qnsObj.type = $('.qnstype', this).val();
				qnsObj.name = $('.qnsname', this).val();
				// if the type is multiple choice, get all the options
				if(qnsObj.type == "mcq" || qnsObj.type == "checkbox") {
					var opts = $('.optname', this).val();
					opts.split(',').forEach(function(item) {
						qnsObj.options.push(item);
					});
				}
				customQns.push(qnsObj);
			}
		);
		
		Meteor.call("updateCustomRF", this.eventId, customQns, function(error, result) {
			if(error) {
				console.log(error.reason);
			} else {
				Router.go("myEvents");
			}
		});
	},

	'click #add': function(event) {
			var intId = $("#buildyourform div").length + 1;
			var qnsWrapper = $("<div class=\"qnswrapper\" id=\"field" + intId + "\"/>");

			var qnsHeader = $("<div class=\"qnsheader row form-group\" id=\"qHeader" + intId + "\"/>");
			var qnsName = $("<div class=\"col-sm-8\"><label>Field Title</label><input type=\"text\" class=\"qnsname form-control\"></div>");
			var qnsType = $("<div class=\"col-sm-4\"><label>Field Type</label><select class=\"qnstype form-control\"><option value=\"checkbox\">Check Boxes</option><option value=\"mcq\">Multiple Choices</option><option value=\"textbox\" selected=\"selected\">Text</option><option value=\"textarea\">Paragraph</option></select></div>");

			var qnsBody = $("<div class=\"qnsbody row form-group\" id=\"qBody" + intId + "\"/>");
			var qnsDisplay = $("<div class=\"col-sm-12\" id=\"fDisplay" + intId + "\"> <label>Options</label> <input type=\"text\" class=\"optname form-control\"> </div>");

			var qnsFooter = $("<div class=\"qnsfooter row form-group\" id=\"qFooter" + intId + "\"/>");
			var qnsRemoveButton = $("<div class=\"col-sm-1 pull-right\"><span role=\"button\" class=\"remove glyphicon glyphicon-trash\" id=\"remove\"></span></div>");
			var qnsAddButton = $("<div class=\"col-sm-1\"><span role=\"button\" class=\"add glyphicon glyphicon-plus\" id=\"add\"></span></div>");

			qnsHeader.append(qnsName);
			qnsHeader.append(qnsType);

			qnsBody.append(qnsDisplay);

			qnsFooter.append(qnsRemoveButton);
			qnsFooter.append(qnsAddButton);

			qnsWrapper.append(qnsHeader);
			qnsWrapper.append(qnsBody);
			qnsWrapper.append(qnsFooter);

			$("#buildyourform").append(qnsWrapper);
	},

	'click #remove': function(e) {
		$(e.target).parent().parent().parent().remove();
	}
});

Template.eventForm_RegistrationForm_Update_Default.events({
	'submit #update-regForm': function(event) {
		event.preventDefault();

		var rf_name = event.target.rf_name.checked;
		var rf_contact_mobile = event.target.rf_contact_mobile.checked;
		var rf_contact_email = event.target.rf_contact_email.checked;
		var rf_address_full = event.target.rf_address_full.checked;
		var rf_address_region = event.target.rf_address_region.checked;
		var rf_shirtSize_sml = event.target.rf_shirtSize_sml.checked;
		var rf_shirtSize_123 = event.target.rf_shirtSize_123.checked;
		var rf_nationality = event.target.rf_nationality.checked;
		var rf_gender = event.target.rf_gender.checked;
		var rf_dietaryPref = event.target.rf_dietaryPref.checked;
		var rf_allergies = event.target.rf_allergies.checked;
		var rf_bloodType = event.target.rf_bloodType.checked;
		var rf_faculty = event.target.rf_faculty.checked;
		var rf_major = event.target.rf_major.checked;
		var rf_nokInfo = event.target.rf_nokInfo.checked;
		var rf_additional = event.target.rf_additional.checked;
		var rf_matric = event.target.rf_matric.checked;
		var rf_nric = event.target.rf_nric.checked;

		Meteor.call("updateDefaultRF", this.eventId, rf_name, rf_contact_mobile, rf_contact_email, rf_address_full, rf_address_region, rf_shirtSize_sml, rf_shirtSize_123, rf_nationality, rf_gender, rf_dietaryPref, rf_allergies, rf_bloodType, rf_faculty, rf_major, rf_nokInfo, rf_additional, rf_matric, rf_nric, function(error, result){
			if(error) {
				console.log(error.reason);
			} else {
				Router.go("myEvents");
			}
		});
	}
});