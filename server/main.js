import { Meteor } from 'meteor/meteor';

UserEvents = new Mongo.Collection('userEvents');

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

Meteor.startup(() => {
  // code to run on server at startup
});

if(Meteor.isServer) {
	Meteor.publish("userEvents", function() {
		return UserEvents.find();
	});
}

Meteor.methods({
	addEvent: function(title, description, location, dateTime, type, privacy){
		UserEvents.insert({
			// lacking img, owner
			title: title,
			description: description,
			location: location,
			dateTime: dateTime,
			type: type,
			privacy: privacy,
			createdAt: new Date()
		});
	},
	removeEvent: function(id){
		UserEvents.remove(id);
	}
});
