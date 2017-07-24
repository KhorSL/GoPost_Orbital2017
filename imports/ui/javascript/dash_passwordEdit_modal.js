import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/dash_passwordEdit_modal.html';
import '../css/dashBoard.css';

Template.dash_passwordEdit_modal.onCreated(function() {
	let template = Template.instance();
	template.errorMessage = new ReactiveVar(""); 
	template.disableBtn = new ReactiveVar(false);
});

Template.dash_passwordEdit_modal.helpers({
	sel_gender: function() {
		if(this.Gender === "Male") {
			return "selected";
		} else {
			return "";
		}
	},
	errorMessage: function() {
		return Template.instance().errorMessage.get();
	},
	disableBtn: function() {
		if(Template.instance().disableBtn.get()) {
			return "disabled";
		} else {
			return "";
		}
	}
});

Template.dash_passwordEdit_modal.events({
	'click #confirmEdit':function(e, tmp) {
		e.preventDefault();
		tmp.errorMessage.set("");
		tmp.disableBtn.set(true);
		var new1 = $('[name=new_password]').val();
		var new2 = $('[name=new_password2]').val();

		if(new1 === new2) { 
			Meteor.call('changePasswordForUser', new1, function(error) {
				if(error) {
					console.log(error.reason);
				} else {
					closeModal();
				}
			});
		} else {
			tmp.errorMessage.set("Password do not match!");
		}
		tmp.disableBtn.set(false);
	}
});

let closeModal = () => {
  $('#edit-password-modal').modal('hide');
  $('.modal-backdrop').fadeOut();
};