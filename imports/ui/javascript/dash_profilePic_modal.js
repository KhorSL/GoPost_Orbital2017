import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/dash_profilePic_modal.html';
import '../html/components/loader.html';
import '../css/dashBoard.css';

Template.dash_profilePic_modal.onCreated(function() {
	let template = Template.instance();
	template.uploading	 = new ReactiveVar( false );
	Session.set("image_uploaded", false);

	template.autorun( () => {
  		var uploads = template.uploading.get();
  	});
});

Template.dash_profilePic_modal.onDestroyed(function() {
	uploadCrop.croppie('destroy');
	delete Session.keys['image_uploaded'];
});

Template.dash_profilePic_modal.onRendered(function() {
	/*Credit: https://stackoverflow.com/questions/27509125/global-variables-in-meteor*/
	/*https://github.com/Foliotek/Croppie*/
	uploadCrop = $('#output').croppie({
    	enableOrientation: true,
    	viewport: {
        	width: 200,
        	height: 200,
        	type: 'circle'
    	},
    	boundary: {
        	width: 300,
        	height: 300
    	}
	});
});

Template.dash_profilePic_modal.helpers({
	img_uploaded: function() {
		if(Session.get("image_uploaded")) {
			return "";
		} else {
			return "disabled";
		}
	},
	uploading: function() {
		return Template.instance().uploading.get();
	}
})

Template.dash_profilePic_modal.events({
	'change #uploadPic': function(event) {
		event.preventDefault();
		var input = event.target;

		if(input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function(e) {
				var dataURL = reader.result;
				output = document.getElementById('output');
				output.src = e.target.result;
				uploadCrop.croppie('bind', {
					url: e.target.result
				});
			};
			reader.readAsDataURL(input.files[0]);
			Session.set("image_uploaded", true);
		}
	},
	'click #submitPic': function(event) {
		event.preventDefault();
		Template.instance().uploading.set(true);
		Session.set("image_uploaded", false); //disable buttons
		uploadCrop.croppie('result', {
			type: 'base64',
			size: {width:200, height:200},
			format: 'png',
			quality: 0.9,
			circle: true
		}).then(function (src) {
			Meteor.call('uploadProfilePicture', Meteor.userId(), src, function(error) {
				if(error) {
					console.log(error.reason);
				}
			}); 
		});

		Template.instance().uploading.set(false);
		Session.set("image_uploaded", true); //enable buttons
		closeModal();
	},
	'click #rotateLeft': function(event) {
		event.preventDefault();
		uploadCrop.croppie('rotate', -90);
	},
	'click #rotateRight': function(event) {
		event.preventDefault();
		uploadCrop.croppie('rotate', 90);
	}
});

let closeModal = () => {
  $('#upload-profile-pic-modal').modal('hide');
  $('.modal-backdrop').fadeOut();
};