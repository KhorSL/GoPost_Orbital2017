import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/settings.html';
import '../css/overall.css';

Template.settings.onCreated(function() {
	let template = Template.instance();
	template.disableBtn = new ReactiveVar(true);
});

Template.settings.helpers({
	selected: function(selected) {
		var details = Users.findOne({"User": Meteor.userId()});
		if(details) {
			if(selected === details.NotificationType) {
				return true;
			} 
		}
		return false;
	},
	disableBtn: function() {
		if(Template.instance().disableBtn.get()) {
			return "disabled";
		} else {
			return "";
		}
	}
});

Template.settings.events({
	'change #noti_settings': function(e,tmp) {
		e.preventDefault();
		tmp.disableBtn.set(false);
	},
	'click #submit': function(e,tmp) {
		tmp.disableBtn.set(true);
		var options = $("#noti_settings").val();
		Meteor.call("updateUserEmailNotification", Meteor.userId(), options, function(error) {
			if(error) {
				console.log(error.reason);
			} else {
				document.location.reload(true);
			}
		});
	}
});