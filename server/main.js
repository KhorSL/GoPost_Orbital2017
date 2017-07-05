import { Meteor } from 'meteor/meteor';
Meteor.startup(() => {
  // code to run on server at startup
});

UserSchema = new SimpleSchema({
  	User: {
    	type: String,
    	label: "User"
  	},
  	Username: {
  		type: String,
  		label: "Username"
  	},
  	Gender: {
    	type: String,
    	label: "Gender"
  	},
  	Age: {
    	type: Number,
    	label: "Age"
  	},
  	LikedList: {
    	type: Array,
		label:"LikedList",
		defaultValue: []
  	},
  	"LikedList.$": {
    	type: String
  	},
  	FollowingList: {
    	type: Array,
		label:"Following",
		defaultValue: []
  	},
  	"FollowingList.$": {
		type: String
	},
	CreatedEventList: {
		type: Array,
		label:"User own created Events",
		defaultValue: []
	},
	"CreatedEventList.$": {
	    type: String
	},
	SignUpEventList: {
		type: Array,
		label: "User's signed up Events",
		defaultValue: []
	},
	"SignUpEventList.$": {
	    type: String
	}
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
		type: Array,
		label: "Location Geometry",
		optional: true,
		//blackbox: true //to skip the validation of things in the object
	},
	"locationGeo.$": {
		type: String
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
	channel: {
		type: Boolean,
		label: "Check if channel created"
	},
	category: {
		type: String,
		label: "Event Category"
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

Cal_EventsSchema = new SimpleSchema({
	title: {
		type: String,
		label: "Title"
	},
	start: {
		type: Date,
		label: "Start"
	},
	end: {
		type: Date,
		label: "End",
		optional: true
	},
	allDay: {
		type: Boolean,
		label: "allDay",
		optional: true
	},
	notes: {
		type: String,
		label: "Notes"
	},
	className: {
		type: String,
		label: "className"
	},
	createdAt: {
		type: Date,
		label: "Created At",
		defaultValue: function() {
			return new Date();
		},
		denyUpdate: true
	},
	owner: {
		type: String,
		label: "Owner",
		defaultValue: function() {
			return Meteor.userId();
		},
		denyUpdate: true
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

MessagesSchema = new SimpleSchema({
	channel: {
    	type: String,
    	label: 'The ID of the channel this message belongs to.',
    	optional: true
  	},
  	to: {
    	type: String,
    	label: 'The ID of the user this message was sent directly to.',
    	optional: true
  	},
  	owner: {
    	type: String,
    	label: 'The ID of the user that created this message.'
  	},
  	timestamp: {
    	type: Date,
    	label: 'The date and time this message was created.'
  	},
  	message: {
    	type: String,
    	label: 'The content of this message.'
  	}
});

RegistrationForms.attachSchema(RegistrationFormsSchema);
Users.attachSchema(UserSchema);
Events.attachSchema(EventsSchema);
Cal_Events.attachSchema(Cal_EventsSchema);
Messages.attachSchema(MessagesSchema);

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

	Meteor.publish("events_limit", function(limit) {
    	return Events.find({}, {sort: {createdAt: -1}, limit: limit});
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

	Meteor.publish("events_Subscribers",function(curUser, sBut, likeSub) {

		if(likeSub) {
			var posterIDs = Users.find({"User": curUser}).map(function (obj) {return obj.LikedList;});
			posterIDs = _.flatten(posterIDs);
			var posterEvents = Events.find({"_id": {"$in" : posterIDs}});
			return posterEvents;
		} else {
			var posterIDs = Users.find({"User": curUser}).map(function (obj) {return obj.FollowingList;});
			posterIDs = _.flatten(posterIDs);
			var posterEvents = Events.find({"owner": {"$in" : posterIDs}});
			return posterEvents;
		}

		/*Credits: https://forums.meteor.com/t/mongodb-returning-array-field/6472/4*/
		/*Credits: https://stackoverflow.com/questions/30650978/meteor-find-using-in-with-array-of-ids*/

		return false;
	}); 

	//This is for user created events
	Meteor.publish("events_Calendar_create", function(curUser) {
		var event_ids = Users.find({"User": curUser}).map(function (obj) {return obj.CreatedEventList});
		event_ids = _.flatten(event_ids);
		var posterEvents = Events.find({"_id" : {$in : event_ids}});

		return posterEvents;
	});

	//This is for user added events on calender
	Meteor.publish("events_Calendar_added", function(curUser) {
		return Cal_Events.find({"owner": curUser});
	});

	Meteor.publish("userDetails_Cur", function(curUser) {
		return Users.find({"User": curUser});
	});

	Meteor.publish("userDetails_All", function(curUser) {
		return Users.find();
	});

  	Meteor.publish("userDetail", function(){
    	return Users.find("Age");
  	});

  	Meteor.publish("userDetails", function() {
  		return Users.find();
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

	Meteor.publish("conversation", function(sender, recever, channel) {
		if(channel === "") {
			//Direct Messages
			return Messages.find(
				{$or: [
					{"owner" : sender}, 
					{"to" : sender}
				]
			});
		} else {
			//Channel Messages
			return Messages.find({"channel" : channel});
		}
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

	addEvent_User: function(event_id) {
		return Users.update({"User" : Meteor.userId()}, {"$addToSet" : {
			"CreatedEventList" : event_id
		}});
		/*Credits http://tgrall.github.io/blog/2015/04/21/mongodb-playing-with-arrays/*/
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
		Users.update({User: Meteor.userId()}, {$addToSet: {
			SignUpEventList: eventId
		}});
		//console.log((Users.findOne({User: Meteor.userId()})));
		// One point of check if current user sign up before
		var priorSubmission = SignUps.findOne({ $and: [
			{eventId: eventId},
			{participantId: Meteor.userId()}
			]
		});
		//console.log(priorSubmission);
		if(priorSubmission != null) {
			console.log("Signed up before");
			return false;
		}

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
			additional: additional,
			confirmation: false
		});
	},

	withdrawSignUp: function(submissionId, eventId) {
		// Remove the eventId from SignUpEventList
		Users.update({User: Meteor.userId()}, {$pull: 
			{
				SignUpEventList: eventId
			}
		});

		//console.log(Users.findOne({User: Meteor.userId()}));
		//Remove the entire sign up form the user submitted previous
		return SignUps.remove(submissionId);
	},

	addEvent: function(title, description, location, locationAddr, locationGeo, start, end, cat, type, channel, privacy, contact, img){
		return Events.insert({
			// Img to further test
			title: title,
			description: description,
			location: location,
			locationAddr: locationAddr,
			locationGeo: locationGeo,
			start: start,
			end: end,
			category: cat,
			type: type,
			channel : channel,
			privacy: privacy,
			contact: contact,
			img: img,
			owner: Meteor.userId(),
			poster: Meteor.user().username,
			createdAt: new Date()
		});
	},

  	insertUserData: function(userid, username,gender,age){
    	Users.insert({
      		User: userid,
      		Username: username,
      		Gender: gender,
      		Age: age
    	});
  	},

	updateEvent: function(id, title, description, location, locationAddr, locationGeo, start, end, cat, type, privacy, contact, img){
		var currEvent = Events.findOne(id);

		if(currEvent.owner !== Meteor.userId()) {
			throw new Meteor.Error('not authorized');
		}

		Events.update(id, {$set: {
			title: title,
			description: description,
			location: location,
			locationAddr: locationAddr,
			locationGeo: locationGeo,
			start: start,
			end: end,
			category: cat,
			type: type,
			privacy: privacy,
			contact: contact,
			img: img
			}
		});
	},

	removeEvent: function(id){
		// Removes the event itself
		Events.remove(id);

		// Remove eventId from CreatedEventList
		Users.update({User: Meteor.userId()}, {$pull: 
			{
				CreatedEventList: id
			}
		});

		//Removes the registration forms template
		RegistrationForms.remove({ eventId: id });

		//Indicate that event is removed to user that sign up for this event, and allow them to remove from their SignUpEventList
		SignUps.update({eventId: id}, {
			$set: 
				{ removed: true }
			},
			{ upsert: true }
		);
	},

	toggleLikes: function(id) {
		// Array of the current users that liked the post
		var currLikers = Events.find( {_id: id}, { likers: 1}).fetch()[0].likers;
		// Check if the current user is in the array
		var q = _.find(currLikers, (x) => x == Meteor.userId());
    	var currUserLL = Users.find({ User: Meteor.userId()}).fetch()[0].LikedList;

		if(q == Meteor.userId()) {
			Events.update( {_id: id}, {
				$inc: { likes: -1 },
				$pull: { likers: Meteor.userId() },
        	});
      
      		Users.update({User:Meteor.userId()}, {
        		$pull: {LikedList:id}
      		});
		
		} else {
			Events.update( {_id: id}, {
				$inc: { likes: 1 },
				$push: { likers: Meteor.userId() },
        		//Add to the ll.
			});
      		
      		Users.update({User:Meteor.userId()}, {
        		$push: { LikedList: id}
      		});
		}
	},

	addCalendarEvents: function(event) {
		return Cal_Events.insert({
			title: event.title,
			start: event.start,
			end: event.end,
			className: event.className,
			allDay: event.allDay,
			notes: event.notes,
			owner: Meteor.userId(),
			createdAt: new Date()
		});
	},

	editCalendarEvents: function(event) {
		return Cal_Events.update(event._id, {
			$set: {
				title: event.title,
				start: event.start,
				end: event.end,
				className: event.className,
				allDay: event.allDay,
				notes: event.notes
			}
		});
	},

	delCalendarEvents: function(event_id) {
		return Cal_Events.remove(event_id);
	},

	moveCalendarEvents: function(event) {
		return Cal_Events.update(event._id, {
			$set: {
				start: event.start,
				end: event.end
			}
		});
	},

	newMessage: function(details) {
		return Messages.insert({
			channel: details.channel,
			to: details.to,
			owner: details.from,
			timestamp: new Date(),
			message: details.msg
		});
  	},

  	startChannel: function(curUser, event_id, event_title, channel) {
		Events.update({"_id": event_id},{"$set" : {
			"channel" : channel
		}});

		var msg = "New channel have been created.";

		return Messages.insert({
			channel: event_title,
			to: "",
			owner: curUser,
			timestamp: new Date(),
			message: msg
		});
  	}

});
