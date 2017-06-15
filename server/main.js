import { Meteor } from 'meteor/meteor';

<<<<<<< HEAD
UserEvents = new Mongo.Collection('userEvents');

UserEventsSchema = new SimpleSchema({
	title: {
		type: String,
		label: "Title"
	},
	description: {
		type: String,
		label: "Description"
	},
	location: {
		type: String,
		label: "Location"
	},
	locationAddr: {
		type: String,
		label: "Location Address",
		optional: true
	},
	locationGeo: {
		type: Object,
		label: "Location Geometry",
		optional: true,
		blackbox: true //to skip the validation of things in the object
	},
	createdAt: {
		type: Date,
		label: "Created At",
		defaultValue: function() {
			return new Date();
		},
		denyUpdate: true
	},
	img: {
		type: String,
		label: "Image",
		optional: true
	},
	owner: {
		type: String,
		label: "Owner",
		defaultValue: function() {
			return Meteor.userId();
		},
		denyUpdate: true
	},
	type: {
		type: Array,
		label: "Event Types"
	},
	"type.$": {
		type: String
	},
	contact: {
		type: String,
		label: "Contact"
	},
	likes: {
		type: Number,
		label: "Likes",
		defaultValue: 0
	},
	likers: {
		type: Array,
		label:"Likers",
		defaultValue: []
	},
	"likers.$": {
		type: String
	},
	privacy: {
		type: Boolean,
		label: "Privacy",
		optional: true
	},
	dateTime: {
		type: String,
		label: "Date and Time",
		optional: true
	}
});

UserEvents.attachSchema(UserEventsSchema);

=======
>>>>>>> B-Edit
Meteor.startup(() => {
  // code to run on server at startup
});

UserEventsSchema = new SimpleSchema({
	title: {
		type: String,
		label: "Title"
	},
	description: {
		type: String,
		label: "Description"
	},
	location: {
		type: String,
		label: "Location"
	},
	locationAddr: {
		type: String,
		label: "Location Address",
		optional: true
	},
	locationGeo: {
		type: Object,
		label: "Location Geometry",
		optional: true,
		blackbox: true //to skip the validation of things in the object
	},
	createdAt: {
		type: Date,
		label: "Created At",
		defaultValue: function() {
			return new Date();
		},
		denyUpdate: true
	},
	img: {
		type: String,
		label: "Image",
		optional: true
	},
	owner: {
		type: String,
		label: "Owner",
		defaultValue: function() {
			return Meteor.userId();
		},
		denyUpdate: true
	},
	type: {
		type: Array,
		label: "Event Types"
	},
	"type.$": {
		type: String
	},
	contact: {
		type: String,
		label: "Contact"
	},
	likes: {
		type: Number,
		label: "Likes",
		defaultValue: 0
	},
	likers: {
		type: Array,
		label:"Likers",
		defaultValue: []
	},
	"likers.$": {
		type: String
	},
	privacy: {
		type: Boolean,
		label: "Privacy",
		optional: true
	},
	dateTime: {
		type: String,
		label: "Date and Time",
		optional: true
	}
});

UserEvents.attachSchema(UserEventsSchema);

if(Meteor.isServer) {
	Meteor.publish("userEvents", function() {
		return UserEvents.find({
			$or: [
				{ privacy: {$ne: true} },
				{ owner: this.userId}
			]
		});
<<<<<<< HEAD
=======
	});

	Meteor.publish("events", function() {
    	return Events.find();
>>>>>>> B-Edit
	});
}

Meteor.methods({
<<<<<<< HEAD
=======
	insertUser: function(newUserData) {
		return Accounts.createUser(newUserData);
	},

>>>>>>> B-Edit
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
<<<<<<< HEAD
});
=======
});
>>>>>>> B-Edit
