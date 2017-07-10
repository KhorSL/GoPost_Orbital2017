import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/dash_profilePic_modal.html';
import '../css/dashBoard.css';

Template.dash_profilePic_modal.onCreated(function() {
	Session.set("image_loaded", false);
});

Template.dash_profilePic_modal.onDestroyed(function() {
	delete Session.keys['image_loaded'];
});

Template.dash_profilePic_modal.onRendered(function() {
	var uploadCrop = $('#upload_box').croppie({
		viewport: {
			width: 100,
			height: 100,
			type: 'circle'
		},
		enableExif: true
	});
})

Template.dash_profilePic_modal.helpers({
	image_loaded: function() {
		return Session.get("image_loaded");
	}
})

Template.dash_profilePic_modal.events({
	'change .img-input': function(event) {
		event.preventDefault();
		var input = event.target;
		if(input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function(e) {
				var dataURL = reader.result;
				output = document.getElementById('output');
				output.src = e.target.result;
				$('#upload_box').addClass('ready');
				$('#upload_box').croppie('bind', {
	            	url: dataURL
	            });
			};
			reader.readAsDataURL(input.files[0]);
			Session.set("image_loaded", true);
		}
	}
});