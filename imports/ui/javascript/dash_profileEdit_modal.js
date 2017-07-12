import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/dash_profileEdit_modal.html';
import '../css/dashBoard.css';


Template.dash_profileEdit_modal.helpers({
	sel_gender: function() {
		if(this.Gender === "Male") {
			return "selected";
		} else {
			return "";
		}
	}
});

Template.dash_profileEdit_modal.events({
	'click #confirmEdit':function(e) {
		e.preventDefault();
		var age = $('#age').val()
		var gender = $("#gender").val();
		
		Meteor.call('updateUserData', Meteor.userId(), gender, age, function(error) {
			if(error) {
				console.log(error.reason);
			} else {
				closeModal();
			}
		})
	}
});

let closeModal = () => {
  $('#edit-profile-modal').modal('hide');
  $('.modal-backdrop').fadeOut();
};