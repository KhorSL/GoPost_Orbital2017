import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import '/imports/startup/server';

Meteor.startup(() => {
  // code to run on server at startup
});

/** Server route to download registration list results **/
Router.route('/download-data/:file', function() {
	var eventId = this.params.file; //params that is passed in thru the anchor link

	// Find the event info in the rfTemplates collection to check for type of reg form and its format
	var currEvent = RegistrationForms.findOne({eventId: eventId});
	var rfChoice = currEvent.RegFormType;

	// Handles both type of reg form
	if(rfChoice == "custom") {
		// fetch the data of all sign ups (in an array) of this particular event in the signUps collection
		var data = SignUps.find({eventId: eventId}).fetch();
		if(data.length == 0) {
			this.response.writeHead(404); //for fun...
			this.response.end("No records, sorry.\n");
		} else {
			// Standard fields that will appear in either type of reg form
			var fields = [
				  {
				  	key: 'createdAt',
				  	title: 'Submission Time'
				  },
				  {
				  	key: "status",
				  	title: 'Registration Status',
				  	transform: function(val, doc) {
				  		if(val == "success") { 
				  			return "success";
				  		} else if(val == "pending") {
				  			return "pending";
				  		} else {
				  			return "rejected";
				  		}
				  	}
				  }
				];

			// Define the fields needed in custom reg form to export the Excel
			var responses = data[0]["userResponseList"]; 
			var len = responses.length; // to get the number of questions in the reg form

			//Create and define the fields
			for(var i = 0; i < len; i++) {
				var currRes = responses[i];
				var resFields = {
					key: 'userResponseList.' + i,
					title: currRes.qnsName,
					transform: function(val, doc) {
						return JSON.stringify(val.response); //transform all responses to string for easy storing
					}
				};
				fields.push(resFields); // add on to the standard fields
			}
		}

	} else {
		var data = SignUps.find({eventId: eventId}).fetch();
		if(data.length == 0) {
			this.response.writeHead(404); //for fun...
			this.response.end("No records, sorry.\n");
		} else {
			// Standard fields that will appear in either type of reg form
			var fields = [
				  {
				  	key: 'createdAt',
				  	title: 'Submission Time'
				  },
				  {
				  	key: "status",
				  	title: 'Registration Status',
				  	transform: function(val, doc) {
				  		if(val == "success") { 
				  			return "success";
				  		} else if(val == "pending") {
				  			return "pending";
				  		} else {
				  			return "rejected";
				  		}
				  	}
				  }
				];
	
			// Default fields
			if(currEvent.name) {
				var defFields = {
					key: "firstName",
					title: "First Name"
				};
				fields.push(defFields);
				defFields = {
					key: "lastName",
					title: "Last Name"
				};
				fields.push(defFields);
			}
	
			if(currEvent.contact_mobile) {
				var defFields = {
					key: "mobile",
					title: "Mobile"
				};
				fields.push(defFields);
			}
	
			if(currEvent.contact_email) {
				var defFields = {
					key: "email",
					title: "Email"
				};
				fields.push(defFields);
			}
	
			if(currEvent.address_full) {
				var defFields = {
					key: "address",
					title: "Address"
				};
				fields.push(defFields);
				defFields = {
					key: "city",
					title: "City"
				};
				fields.push(defFields);
				defFields = {
					key: "postal",
					title: "Postal"
				};
				fields.push(defFields);
			}
	
			if(currEvent.address_region) {
				var defFields = {
					key: "region",
					title: "Region"
				};
				fields.push(defFields);
			}
	
			if(currEvent.shirtSize_SML) {
				var defFields = {
					key: "shirtSize_SML",
					title: "Shirt Size"
				};
				fields.push(defFields);
			}
	
			if(currEvent.shirtSize_123) {
				var defFields = {
					key: "shirtSize_123",
					title: "Shirt Size"
				};
				fields.push(defFields);
			}
	
			if(currEvent.nationality) {
				var defFields = {
					key: "nationality",
					title: "Nationality"
				};
				fields.push(defFields);
			}
	
			if(currEvent.gender) {
				var defFields = {
					key: "gender",
					title: "Gender"
				};
				fields.push(defFields);
			}
	
			if(currEvent.allergies) {
				var defFields = {
					key: "allergies",
					title: "Allergies"
				};
				fields.push(defFields);
			}
	
			if(currEvent.dietaryPref) {
				var defFields = {
					key: "dietaryPref",
					title: "Dietary Preference"
				};
				fields.push(defFields);
			}
	
			if(currEvent.bloodType) {
				var defFields = {
					key: "bloodType",
					title: "Blood Type"
				};
				fields.push(defFields);
			}
	
			if(currEvent.faculty) {
				var defFields = {
					key: "faculty",
					title: "Faculty"
				};
				fields.push(defFields);
			}
	
			if(currEvent.major) {
				var defFields = {
					key: "major",
					title: "Major"
				};
				fields.push(defFields);
			}
	
			if(currEvent.nokInfo) {
				var defFields = {
					key: "nok_firstName",
					title: "NOK First Name"
				};
				fields.push(defFields);
				defFields = {
					key: "nok_lastName",
					title: "NOK Last Name"
				};
				fields.push(defFields);
				defFields = {
					key: "nok_mobile",
					title: "NOK Mobile"
				};
				fields.push(defFields);
				defFields = {
					key: "nok_address",
					title: "NOK Address"
				};
				fields.push(defFields);
			}
	
			if(currEvent.additional) {
				var defFields = {
					key: "additional",
					title: "Additional Comments"
				};
				fields.push(defFields);
			}
	
			if(currEvent.matric) {
				var defFields = {
					key: "matric",
					title: "Matriculation Number"
				};
				fields.push(defFields);
			}
	
			if(currEvent.nric) {
				var defFields = {
					key: "nric",
					title: "NRIC"
				};
				fields.push(defFields);
			}
		}
	}

	if(data.length > 0) {
		var title = 'Registration_result';
		var file = Excel.export(title, fields, data);
		var headers = {
		  'Content-type': 'application/vnd.openxmlformats',
		  'Content-Disposition': 'attachment; filename=' + title + '.xlsx'
		};

		this.response.writeHead(200, headers);
		this.response.end(file, 'binary');
	}
}, { where: 'server' });
/** End of server side route download **/

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
  	Token: {
  		type: String,
  		label: "Verification Token"
  	},
	TokenExpired: {
		type: Date,
		label: "Verification Expired Date",
	},
  	profilePic: {
		type: String,
		label: "Profile Picture",
		optional: true
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
		type: [Object],
		label:"User own created Events",
		defaultValue: []
	},
	"CreatedEventList.$.eventID": {
	    type: String,
	    label: "User Created Event ID"
	},
	"CreatedEventList.$.eventTitle": {
	    type: String,
	    label: "User Created Event Title"
	},
	"CreatedEventList.$.lastRead": {
		type: Date,
		label: "the last time the message in channel was read (Created).",
		optional: true
	},
	"CreatedEventList.$.lastRead_Count": {
		type: Number,
		label: "the last count the message in channel was unread (Created).",
		defaultValue: 0
	},
	SignUpEventList: {
		type: [Object],
		label: "User's signed up Events",
		defaultValue: []
	},
	"SignUpEventList.$.eventID": {
	    type: String,
	    label: "User Signed up Event ID"
	},
	"SignUpEventList.$.eventTitle": {
	    type: String,
	    label: "User Signed up Event Title"
	},
	"SignUpEventList.$.lastRead": {
	    type: Date,
	    label: "the last time the message in channel was read (signedUp).",
	    optional: true
	},
	"SignUpEventList.$.lastRead_Count": {
		type: Number,
		label: "the last count the message in channel was unread (signedUp).",
		defaultValue: 0
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
	},
	customQns: {
		type: Array,
		label: "Custom RF Question List",
		optional: true,
		blackbox: true
	},
	"customQns.$": {
		type: Object
	},
	RegFormType: {
		type: String,
		label: "Registration Form Type"
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

MsgCountSchema = new SimpleSchema({
	chatID: {
		type: String,
		label: "Chat ID"
	},
	count: {
		type: Number,
		label: "Number of newly received message",
		defaultValue: 0,
		optional: true
	},
	lastMsg: {
		type: String,
		label: "The content of the last message sent in chat"
	},
	lastMsgBy: {
		type: String,
		label: "The username of the last message sent in chat"
	},
	lastMsgBy_ID: {
		type: String,
		label: "The userID of the last message sent in chat"
	},
	timestamp: {
		type: Date,
		label: "The date and time the last message was sent"
	}
});

RegistrationForms.attachSchema(RegistrationFormsSchema);
Users.attachSchema(UserSchema);
Events.attachSchema(EventsSchema);
Cal_Events.attachSchema(Cal_EventsSchema);
Messages.attachSchema(MessagesSchema);
MessagesCount.attachSchema(MsgCountSchema);

if(Meteor.isServer) {
	Meteor.publish("userEvents", function() {
		return Events.find({
			owner: this.userId
		});
	});

	Meteor.publish("userEvents_Page", function(skipCount) {
		return Events.find({
			owner: this.userId
		}, {
			sort: {createdAt: -1},
			limit: 6,
			skip: skipCount
		});
	});

	Meteor.publish("events", function() {
    	return Events.find();
	});

	Meteor.publish("events_ONE", function(eventid) {
    	return Events.find({_id: eventid});
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
		event_ids = _.pluck(_.flatten(event_ids), 'eventID');
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

  	Meteor.publish("user_subscriptions", function(curUser) {
  		var sub_list = Users.find({"User": curUser}).fetch().map(function (obj) {return obj.FollowingList;});
		sub_list = _.flatten(sub_list);
		return Users.find({"User": {"$in" : sub_list}});
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

	Meteor.publish("users_msg_count", function() {
		return MessagesCount.find();
	});

	/*
	Accounts.onCreateUser(function(options,user) {
		/*http://www.javacms.tech/questions/4386957/generating-a-verification-token-in-meteor-without-sending-an-email
		  https://themeteorchef.com/tutorials/sign-up-with-email-verification
		  https://themeteorchef.com/tutorials/using-the-email-package#tmc-configuration
		  https://github.com/wekan/wekan/wiki/Troubleshooting-Mail
		  https://stackoverflow.com/questions/10888610/ignore-invalid-self-signed-ssl-certificate-in-node-js-with-https-request
		  https://stackoverflow.com/questions/20433287/node-js-request-cert-has-expired#answer-29397100

		//send email with random token
		user.accVerficationCode = Random.hexString(10).toLowerCase();
		Meteor.call("sendVerificationToken",options.email, user.accVerficationCode);
		return user;
	});*/
	
	/*https://stackoverflow.com/questions/19391308/custom-fields-on-meteor-users-not-being-published
	Meteor.publish('userData', function() {
  		if(!this.userId) 
  			return null;
  		return Meteor.users.find(this.userId, {fields: {
    		accVerficationCode: 1, accVerficationCodeDate: 1
  		}});
	});*/
}

Meteor.methods({
	insertUser: function(newUserData) {
		return Accounts.createUser(newUserData);
	},

	sendVerificationToken: function(email) {
		var token = Random.hexString(10).toLowerCase();

		this.unblock();

		if(email) {
			Email.send({
	  			to: email,
	  			from: "GoPost! <gopostnow@gmail.com>",
	  			subject: "Please verify your GoPost! account.",
	  			html: "<p>Hi,</p><p>Thanks for using GoPost! Please verify your email account with the token provided below. We'll communicate with you from time to time via email so it's important that we have an up-to-date email address on file.</p><p>" + token + "</p><p>If you did not sign up for a GoPost! account, please ignore this message.</p>"
			});

			return token;
		}

		return false;
	},

	checkIfUserEmailExists: function(email) {
		return Accounts.findUserByEmail(email);
	},

	verifyUserAccount: function() {
		//Fake the verificationToken by creating our own token
		var token = Random.secret();
		var tokenRecord = {
    		token: token,
    		address: Meteor.user().emails[0].address,
    		when: new Date(),
		};

		//Save the user
		return Meteor.users.update({_id: Meteor.userId()}, {
			$push: {"services.email.verificationTokens": tokenRecord},
			$set: {"emails.0.verified" : true}
		});
	},

	sendResetPasswordEmail: function(email) {
		var pass = Random.id(15);

		this.unblock();

		if(email) {
			Email.send({
	  			to: email,
	  			from: "GoPost! <gopostnow@gmail.com>",
	  			subject: "Reset Password for your GoPost! account.",
	  			html: "<p>Hi,</p><p>Thanks for using GoPost! Your password have been reset.</p><p>New password: " + pass + "</p><p>Please change your password. Thank You.</p>"
			});
			return pass;
		}

		return false;
	},

	resetPasswordForUser: function(email, password) {
		var user = Accounts.findUserByEmail(email);
		return Accounts.setPassword(user._id, password);
	},

	addEventTag: function(tags) {
		for(var i in tags) {
			var tag = tags[i].trim();
			Tags.update(tag, {tag: tag, createdAt: new Date()}, {upsert: true});
		}
	},

	addEvent_User: function(event_id, title) {
		return Users.update({"User" : Meteor.userId()}, {
			"$addToSet" : {
				"CreatedEventList" : {
					"eventID" : event_id,
					"eventTitle" : title,
					"lastRead" : null,
					"lastRead_Count" : 0
				}
			}
		});
		/*Credits http://tgrall.github.io/blog/2015/04/21/mongodb-playing-with-arrays/*/
	},

	addCustomRF: function(eventId, title, customQns) {
		return RegistrationForms.insert({
			RegFormType: "custom",
			owner: Meteor.userId(),
			createdAt: new Date(),
			eventId: eventId,
			eventTitle: title,
			customQns: customQns
		});
	},

	addRegistrationForm: function(eventId, title, description, name, contact_mobile, contact_email, address_full, address_region, shirtSize_SML, shirtSize_123, shirtSize_Chart, nationality, gender, dietaryPref, allergies, bloodType, faculty, major, nokInfo, additional, matric, nric) {
		return RegistrationForms.insert({
			RegFormType: "default",
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

	addSignUpCustom: function(eventId, eventTitle, userResponseList) {
		Users.update({User: Meteor.userId()}, {
			$addToSet: {
				SignUpEventList: {
					"eventID" : eventId,
					"eventTitle" : eventTitle,
					"lastRead" : null,
					"lastRead_Count" : 0
				}
			}
		});

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
			eventTitle: eventTitle,
			status: "pending",
			userResponseList: userResponseList
		});
	},

	addSignUp: function(eventId, eventTitle, firstName, lastName, nric, matric, gender, nationality, address, city, region, postal, faculty, major, mobile, email, dietaryPref, bloodType, allergies, shirtSize_SML, shirtSize_123, nok_rs, nok_firstName, nok_lastName, nok_mobile, nok_address, additional) {
		Users.update({User: Meteor.userId()}, {$addToSet: {
				SignUpEventList: {
					"eventID" : eventId,
					"eventTitle" : eventTitle,
					"lastRead" : null,
					"lastRead_Count" : 0
				}
			}
		});
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
			eventTitle: eventTitle,
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
			bloodType: bloodType,
			allergies: allergies,
			shirtSize_SML: shirtSize_SML,
			shirtSize_123: shirtSize_123,
			nok_rs: nok_rs,
			nok_firstName: nok_firstName,
			nok_lastName: nok_lastName,
			nok_mobile: nok_mobile,
			nok_address: nok_address,
			additional: additional,
			status: "pending"
		});
	},

	withdrawSignUp: function(submissionId, eventId) {
		// Remove the eventId from SignUpEventList
		Users.update({User: Meteor.userId()}, {
			$pull: {
				SignUpEventList: {
					"eventID" : eventId
				}
			}
		});

		//console.log(Users.findOne({User: Meteor.userId()}));
		//Remove the entire sign up form the user submitted previous
		return SignUps.remove(submissionId);
	},

	acceptSignUp: function(submissionId) {
		SignUps.update({_id: submissionId}, {$set: {status: "success"}});
	},

	rejectSignUp: function(submissionId) {
		SignUps.update({_id: submissionId}, {$set: {status: "rejected"}});
	},

	addEvent: function(title, description, location, locationAddr, locationGeo, start, end, cat, type, channel, contact, img){
		return Events.insert({
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
			contact: contact,
			img: img,
			owner: Meteor.userId(),
			poster: Meteor.user().username,
			createdAt: new Date()
		});
	},

  	insertUserData: function(userid, username,gender,age, token){
    	Users.insert({
      		User: userid,
      		Username: username,
      		Gender: gender,
      		Age: age,
      		Token: token,
      		TokenExpired: new Date()
    	});
  	},

  	updateUserData: function(userid, gender, age){
    	Users.update({User:userid}, {
    		$set: {
    			Gender: gender,
      			Age: age
    		}
    	});
  	},

  	uploadProfilePicture: function(userid, source){
    	Users.update({User: userid}, {
    		$set: {
				profilePic: source
			}
    	});
  	},

	updateEvent: function(id, title, description, location, locationAddr, locationGeo, start, end, cat, type, contact, img){
		var currEvent = Events.findOne(id);

		if(currEvent.owner !== Meteor.userId()) {
			throw new Meteor.Error('not authorized');
		}

		RegistrationForms.update({eventId: id}, {$set: {
			eventTitle: title
		}});

		Users.update({User: Meteor.userId(), "CreatedEventList.eventID" : id}, {
			$set: {
				"CreatedEventList.$.eventTitle" : title
			}
		})

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
			contact: contact,
			img: img
			}
		});
	},

	removeEvent: function(id){
		// Removes the event itself
		Events.remove(id);

		// Remove eventId from CreatedEventList
		Users.update({User: Meteor.userId()}, {
			$pull: {
				CreatedEventList: {
					"eventID" :	id
				}
			}
		});

		//Removes the registration forms template
		RegistrationForms.remove({ eventId: id });

		//Remove from user SignUpEventList
		SignUps.remove({eventId: id});
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

	unsubscribe: function(id) {
		// Remove the userId from FollowingList
		Users.update({User: Meteor.userId()}, {$pull: 
			{
				FollowingList: id
			}
		});

	},

	subscribe: function(id) {
		// Remove the userId from FollowingList
		Users.update({User: Meteor.userId()}, {"$addToSet" : {
			"FollowingList" : id
		}});

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

  	addMessageCount: function(details) {
  		var chatID = details.to;
  		if(details.channel !== "") {
  			chatID = details.channel;
  			return MessagesCount.update({chatID: chatID}, {
	  			$set:{
	  				chatID: chatID,
	  				lastMsg: details.msg,
					lastMsgBy: Meteor.user().username,
					lastMsgBy_ID: details.from,
					timestamp: details.ts 
	  			},
				$inc: { count: +1 }
	  		}, {upsert: true});
  		} else {
	  		return MessagesCount.update({chatID: chatID, lastMsgBy_ID: details.from}, {
	  			$set:{
	  				chatID: chatID,
	  				lastMsg: details.msg,
					lastMsgBy: Meteor.user().username,
					lastMsgBy_ID: details.from,
					timestamp: details.ts 
	  			},
				$inc: { count: +1 }
	  		}, {upsert: true});
	  	}
  	},

  	emptyMessageCount: function(userID,fromID) {
  		return MessagesCount.remove({chatID: userID, lastMsgBy_ID: fromID});
  	},

  	update_Channel_msg_Count: function(signOrCreated, userID, eventID, lastRead, lastRead_Count) {
  		if(signOrCreated) {
  			return Users.update({User: userID, "SignUpEventList.eventTitle" : eventID}, {
				$set: {
					"SignUpEventList.$.lastRead" : lastRead,
					"SignUpEventList.$.lastRead_Count" : lastRead_Count
				}
			});
  		} else {
  			return Users.update({User: userID, "CreatedEventList.eventTitle" : eventID}, {
				$set: {
					"CreatedEventList.$.lastRead" : lastRead,
					"CreatedEventList.$.lastRead_Count" : lastRead_Count
				}
			});
  		}
  	},

  	startChannel: function(curUser, event_id, event_title, channel) {
		Events.update({"_id": event_id},{"$set" : {
			"channel" : channel
		}});

		var msg = "New channel have been created.";
		var ts = new Date();

		Messages.insert({
			channel: event_title,
			to: "",
			owner: curUser,
			timestamp: ts,
			message: msg
		});

		return MessagesCount.update({chatID: event_title, lastMsgBy_ID: curUser}, {
  			$set:{
  				chatID: event_title,
  				lastMsg: msg,
				lastMsgBy: Meteor.user().username,
				lastMsgBy_ID: curUser,
				timestamp: ts 
  			},
			$inc: { count: +1 }
  		}, {upsert: true});
  	}

});