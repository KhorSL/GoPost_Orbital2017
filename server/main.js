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
		return UserEvents.find({
			$or: [
				{ privacy: {$ne: true} },
				{ owner: this.userId}
			]
		});
	});
}

Meteor.methods({
	addEvent: function(title, description, location, locationAddr, locationGeo, dateTime, type, privacy, contact, img){
		UserEvents.insert({
			// Img to further test
			title: title,
			description: description,
			location: location,
			locationAddr: locationAddr,
			locationGeo: locationGeo,
			dateTime: dateTime,
			type: type,
			privacy: privacy,
			contact: contact,
			img: img,
			owner: Meteor.userId(),
			createdAt: new Date()
		});
	},

	updateEvent: function(id, title, description, location, locationAddr, locationGeo, dateTime, type, privacy, contact, img){
		var currEvent = UserEvents.findOne(id);

		if(currEvent.owner !== Meteor.userId()) {
			throw new Meteor.Error('not authorized');
		}

		UserEvents.update(id, {$set: {
			title: title,
			description: description,
			location: location,
			locationAddr: locationAddr,
			locationGeo: locationGeo,
			dateTime: dateTime,
			type: type,
			privacy: privacy,
			contact: contact,
			img: img,
			}
		});
	},

	removeEvent: function(id){
		UserEvents.remove(id);
	},

	toggleLikes: function(id) {
		// Array of the current users that liked the post
		var currLikers = UserEvents.find( {_id: id}, { likers: 1}).fetch()[0].likers;
		// Check if the current user is in the array
		var q = _.find(currLikers, (x) => x == Meteor.userId());
		
		if(q == Meteor.userId()) {
			UserEvents.update( {_id: id}, { 
				$inc: { likes: -1 },
				$pull: { likers: Meteor.userId() } 
			});
		} else {
			UserEvents.update( {_id: id}, { 
				$inc: { likes: 1 },
				$push: { likers: Meteor.userId() } 
			});
		}
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
