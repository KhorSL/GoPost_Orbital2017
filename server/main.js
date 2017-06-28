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
	start: {
		type: Date,
		label: "Start",
		optional: true
	},
	end: {
		type: Date,
		label: "End",
		optional: true
	}
});

RegistrationFormsSchema = new SimpleSchema({
	owner: {
		type: String,
		label: "Owner",
		defaultValue: function() {
			return Meteor.userId();
		},
		denyUpdate: true
	},
	createdAt: {
		type: Date,
		label: "Created At",
		defaultValue: function() {
			return new Date();
		},
		denyUpdate: true
	},
	eventId: {
		type: String,
		label: "Event ID",
		denyUpdate: true
	},
	eventTitle: {
		type: String,
		label: "Event Title"
	},
	description: {
		type: Boolean,
		label: "Description",
		optional: true
	},
	name: {
		type: Boolean,
		label: "Name",
		optional: true
	},
	contact_mobile: {
		type: Boolean,
		label: "Contact (Mobile)",
		optional: true
	},
	contact_email: {
		type: Boolean,
		label: "Contact (Email)",
		optional: true
	},
	address_full: {
		type: Boolean,
		label: "Full Address",
		optional: true
	},
	address_region: {
		type: Boolean,
		label: "Address Region",
		optional: true
	},
	shirtSize_SML: {
		type: Boolean,
		label: "Shirt Size (SML)",
		optional: true
	},
	shirtSize_123: {
		type: Boolean,
		label: "Shirt Size (123)",
		optional: true
	},
	shirtSize_Chart: {
		type: Boolean,
		label: "Shirt Size Chart",
		optional: true
	},
	nationality: {
		type: Boolean,
		label: "Nationality",
		optional: true
	},
	gender: {
		type: Boolean,
		label: "Gender",
		optional: true
	},
	allergies: {
		type: Boolean,
		label: "Allergies",
		optional: true
	},
	dietaryPref: {
		type: Boolean,
		label: "Dietary Preferences",
		optional: true
	},
	bloodType: {
		type: Boolean,
		label: "Blood Type",
		optional: true
	},
	faculty: {
		type: Boolean,
		label: "Faculty",
		optional: true
	},
	major: {
		type: Boolean,
		label: "Major",
		optional: true
	},
	nokInfo: {
		type: Boolean,
		label: "Next-of-kin Information",
		optional: true
	},
	additional: {
		type: Boolean,
		label: "Additional Information",
		optional: true
	},
	matric: {
		type: Boolean,
		label: "Additional Information",
		optional: true
	},
	nric: {
		type: Boolean,
		label: "Additional Information",
		optional: true
	}
});

RegistrationForms.attachSchema(RegistrationFormsSchema);
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

	Meteor.publish('events_Filter', function(search, tag, sBut) {
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

	Meteor.publish("rfTemplates", function() {
		return RegistrationForms.find();
	});

	Meteor.publish("signUps", function() {
		return SignUps.find();
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

	addRegistrationForm: function(eventId, title, description, name, contact_mobile, contact_email, address_full, address_region, shirtSize_SML, shirtSize_123, shirtSize_Chart, nationality, gender, dietaryPref, allergies, bloodType, faculty, major, nokInfo, additional, matric, nric) {
		return RegistrationForms.insert({
			owner: Meteor.userId(),
			createdAt: new Date(),
			eventId: eventId,
			eventTitle: title,
			description: description,
			name: name,
			contact_mobile: contact_mobile,
			contact_email: contact_email,
			address_full: address_full,
			address_region: address_region,
			shirtSize_SML: shirtSize_SML,
			shirtSize_123: shirtSize_123,
			shirtSize_Chart: shirtSize_Chart,
			nationality: nationality,
			gender: gender,
			allergies: allergies,
			dietaryPref: dietaryPref,
			bloodType: bloodType,
			faculty: faculty,
			major: major,
			nokInfo: nokInfo,
			additional: additional,
			matric: matric,
			nric: nric
		});
	},

	addSignUp: function(eventId, firstName, lastName, nric, matric, gender, nationality, address, city, region, postal, faculty, major, mobile, email, dietaryPref, allergies, shirtSize_SML, shirtSize_123, nok_rs, nok_firstName, nok_lastName, nok_mobile, additional) {
		return SignUps.insert({
			participantId: Meteor.userId(),
			createdAt: new Date(),
			eventId: eventId,
			firstName: firstName,
			lastName: lastName,
			nric: nric,
			matric: matric,
			gender: gender,
			nationality: nationality,
			address: address,
			city: city,
			region: region,
			postal: postal,
			faculty: faculty,
			major: major,
			mobile: mobile,
			email: email,
			dietaryPref: dietaryPref,
			allergies: allergies,
			shirtSize_SML: shirtSize_SML,
			shirtSize_123: shirtSize_123,
			nok_rs: nok_rs,
			nok_firstName: nok_firstName,
			nok_lastName: nok_lastName,
			nok_mobile: nok_mobile,
			additional: additional
		});
	},

	addEvent: function(title, description, location, locationAddr, locationGeo, start, end, type, privacy, contact, img){
		return Events.insert({
			// Img to further test
			title: title,
			description: description,
			location: location,
			locationAddr: locationAddr,
			locationGeo: locationGeo,
			start: start,
			end: end,
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
		Events.remove(id);
		RegistrationForms.remove({ eventId: id });
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
