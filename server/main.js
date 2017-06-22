import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

EventsSchema = new SimpleSchema({
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
	poster: {
		type: String,
		label: "Poster",
		defaultValue: function() {
			return Meteor.user().username;
		},
		denyUpdate: true
	},
	type: {
		type: Array,
		label: "Event Tags"
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

Events.attachSchema(EventsSchema);

if(Meteor.isServer) {
	Meteor.publish("userEvents", function() {
		return Events.find({
			$or: [
				{ privacy: {$ne: true} },
				{ owner: this.userId}
			]
		});
	});

	Meteor.publish("events", function() {
    	return Events.find();
	});

	Meteor.publish('events_Filter', function(search, filterType, tag, sBut) {
		check(search, Match.OneOf(String, null, undefined));

  		var query = {};
      	var projection = {sort: {title: 1}};

  		if(search) {
    		var regex = new RegExp(search,'i');
    		query = {
      			$or: [
        			{ title: regex }
      			]
    		};
  		} else {
  			if(tag) {
  				query = {
  					$or: [
  						{ type: tag }
  					]
  				}
  			}
  		}

  		return Events.find(
  			query, projection
  		);
	});

	Meteor.publish("event_Tags", function () {
		return Tags.find();
	});
}

Meteor.methods({
	insertUser: function(newUserData) {
		return Accounts.createUser(newUserData);
	},

	addEventTag: function(tags) {
		for(var i in tags) {
			var tag = tags[i].trim();
			Tags.update(tag, {tag: tag, createdAt: new Date()}, {upsert: true});
		}
	},

	addEvent: function(title, description, location, locationAddr, locationGeo, dateTime, type, privacy, contact, img){
		return Events.insert({
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
			poster: Meteor.user().username,
			createdAt: new Date()
		});
	},

	/*
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
	*/

	removeEvent: function(id){
		return Events.remove(id);
	},

	toggleLikes: function(id) {
		// Array of the current users that liked the post
		var currLikers = Events.find( {_id: id}, { likers: 1}).fetch()[0].likers;
		// Check if the current user is in the array
		var q = _.find(currLikers, (x) => x == Meteor.userId());
		
		if(q == Meteor.userId()) {
			Events.update( {_id: id}, { 
				$inc: { likes: -1 },
				$pull: { likers: Meteor.userId() } 
			});
		} else {
			Events.update( {_id: id}, { 
				$inc: { likes: 1 },
				$push: { likers: Meteor.userId() } 
			});
		}
	}
});
