import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/eventForm_RegistrationForm.html';

if(Meteor.isClient) {
	Template.eventForm_RegistrationForm.events({
		'click #rf-selectAll': function(event) {
			event.preventDefault();
			$('.rf:checkbox').prop('checked', !$('.rf:checkbox').prop('checked'));
		}
	});
}