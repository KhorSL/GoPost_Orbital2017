import { Meteor } from 'meteor/meteor';

UserEvents = new Mongo.Collection('userEvents');

/*==========================================
Images = new FS.Collection('Images', {
	stores: [new FS.Store.GridFS('Images')],
		filter: {
			allow: {
				contentTypes: ['image/*']
			},
			onInvalid: function(message) {
				console.log(message);
			}
		}
});
===========================================*/

Meteor.startup(() => {
  // code to run on server at startup
});

if(Meteor.isServer) {
	Meteor.publish("userEvents", function() {
		return UserEvents.find();
	});
}

Meteor.methods({
	addEvent: function(title, description, location, locationAddr, dateTime, type, privacy, contact, img){
		UserEvents.insert({
			// lacking owner. Img to further test
			title: title,
			description: description,
			location: location,
			locationAddr: locationAddr,
			dateTime: dateTime,
			type: type,
			privacy: privacy,
			contact: contact,
			img: img,
			createdAt: new Date()
		});
	},
	removeEvent: function(id){
		UserEvents.remove(id);
	}
	/*===========================================================
	addImage: function(newFile) {
		Images.insert(newFile, function(error, result){
			if(error) {
				console.log('There is an issue with the upload');
			} else {
				console.log('Image Uploaded');
			}
		});
	}
	============================================================*/
});
