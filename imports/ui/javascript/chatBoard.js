import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/loader.html';
import '../html/chatBoard.html';
import '../css/chatBoard.css';
import './chat_messageView.js';
import './chat_channelModal.js';

/*Credits:
https://bootsnipp.com/snippets/vrzGb
https://codepen.io/drehimself/pen/KdXwxR
https://bootsnipp.com/snippets/33ejn
https://bootsnipp.com/snippets/EkQe7
*/

Template.chatBoard.onCreated(function() {
	let template = Template.instance();

	template.subscribe("events");

	Session.set("sender", Meteor.userId());
	Session.set("recever", "");
	Session.set("recever_details", null);
	Session.set("channel", "");
	Session.set("trigger", true); 			//for search bar
	Session.set("search_Tag", false);  		//for search bar
	Session.set("query", ""); 				//for search bar

	template.autorun( () => {
		var sender = Session.get("sender");
		var recever = Session.get("recever");
		var trig = Session.get("trigger");
		var channel = Session.get("channel");
    	
    	template.subscribe('conversation', sender, recever, channel, () => {
	      	setTimeout( () => {
	        	Session.set("searching", false);
	      	}, 300 );
    	});

    	template.subscribe('userDetails_All', trig);
    	template.subscribe('users_msg_count');
  	});
});

Template.chatBoard.onRendered(function() {
	var chatTgt = Session.get("chat_Target");
	if(typeof(chatTgt) != 'undefined' && chatTgt !== "") {
		$('[name=search_query]').val(chatTgt.Username);
		$("#searchBut").click();
	}

	var chatChan = Session.get("chat_Channel");
	if(typeof(chatChan) != 'undefined' && chatChan) {
		$('.nav-pills a:last').tab('show');
	}
});

Template.chatBoard.onDestroyed(function() {
	delete Session.keys['channel','sender','recever','recever_details','trigger','search_Tag','query','chat_Target','chat_Channel'];
});

Template.chatBoard.helpers({
	channels: function() {
		var sender = Session.get("sender");

		//Get all events I signed up for & Created by Me.
		var signedups = Users.find({"User":sender}).fetch().map(function (obj) {return obj.SignUpEventList;});
		signedups = _.pluck(_.flatten(signedups), 'eventID');
		var event_list = Events.find({
			$or: [
				{ "_id": {"$in" : signedups}, "channel" : {$ne: false} },
				{ "owner": sender, "channel" : {$ne: false}}
			]
		}).fetch().map(function (obj) {return obj.title;});
		/*
		//Get all events I signed up for
		var event_list = Events.find({
			$and: [
			 	{ "_id": {"$in" : signedups}},
				{ "channel" : {$ne: false}}
			]}).fetch().map(function (obj) {return obj.title;});

		//Get all events I created
		var event_list2 = Events.find({
			$and: [
			 	{"owner": sender},
				{"channel" : {$ne: false}}
			]}).fetch().map(function (obj) {return obj.title;});

		//check if channel is created.
		event_list = _.uniq(event_list.concat(event_list2)); 
		*/
		return event_list;
	},
	messages: function() {
		var sender = Session.get("sender");
		//Get all messages send by me
		var convo_list = Messages.find({"owner" : sender}).fetch().map(function (obj) {return obj.to;});
		//Get all messages others send to me
		var convo_list2 = Messages.find({"to" : sender}).fetch().map(function (obj) {return obj.owner;});

		//distinct the users who sent the messages
		convo_list = _.uniq(convo_list.concat(convo_list2));
		//get user details based on list above
		var convo_with = Users.find({"User": {"$in" : convo_list}});

		//Setting Active li for first Message. only when redirected from user's Dashboard
		var chatTgt = Session.get("chat_Target"); 
		if(typeof(chatTgt) !== 'undefined' && chatTgt !== "") {
			if(convo_with.count() > 0) {
				Session.set("recever", chatTgt.User);
				Session.set("recever_details", chatTgt);
			}
		}

		return convo_with;
	},
	msgHistory: function() {
		var sender = Session.get("sender");
		var recever = Session.get("recever");
		var channel = Session.get("channel");

		if(channel === "") {
			//Display Direct Messages
			return Messages.find(
				{$or: [
					{ $and: [ {"owner" : sender}, {"to" : recever} ] },
					{ $and: [ {"owner" : recever}, {"to" : sender} ] }
				] 
			}, {sort: {timestamp: 1}});
		} else {
			//Display Channel Messages
			return Messages.find({"channel" : channel}, {sort: {timestamp: 1}});
		}
	},
	friend: function() {
		if(Session.get("search_Tag")) {
			var sq = Session.get("query");
			var regex = new RegExp(sq,'i');
			return Users.find({"Username": regex}).fetch();
		} else {
			var sender = Session.get("sender");
			var sub_list = Users.find({"User": Meteor.userId()}).fetch().map(function (obj) {return obj.FollowingList;});
			sub_list = _.flatten(sub_list);
			return Users.find({"User": {"$in" : sub_list}}).fetch();
		}
	},
	msgCount: function() {
		var sender = Session.get("sender");
		var recever = Session.get('recever');
		var chatID = this.User;

		if(recever === chatID) {
			//setting Message Count to 0 if user reads the message.
			Meteor.call("emptyMessageCount", sender, chatID, function(error) {
				if(error) {
					console.log(error.reason);
				}
			});
			return false;
		} else {
			//https://stackoverflow.com/questions/18975131/retrieving-specific-field-from-meteor-collection-document-into-js-file-and-strip
			return MessagesCount.findOne({
				chatID: sender, lastMsgBy_ID: chatID
			});
		}
		return false;
	},
	msgCount_channel: function() {
		var sender = Session.get("sender");
		var channel = Session.get('channel');
		var chatID = this.valueOf(); //https://stackoverflow.com/questions/26147697/each-string-in-an-array-with-blaze-in-meteor
		var signOrCreated = true; //true = signup, false = created

		//Get all events with channel created. 
		var signup_List = _.flatten(Users.find({"User": sender}).fetch().map(function(obj) {return obj.SignUpEventList}));
		var channel_Obj = _.findWhere(signup_List, {eventTitle: chatID});
		if(!channel_Obj) {
			var created_list = _.flatten(Users.find({"User": sender}).fetch().map(function(obj) {return obj.CreatedEventList}));
			channel_Obj = _.findWhere(created_list, {eventTitle: chatID});
			signOrCreated = false;
		}
		var message = MessagesCount.findOne({chatID: chatID});

		if(channel === chatID) {
			//Update timestamp and count when read.
			Meteor.call("update_Channel_msg_Count", signOrCreated, sender, chatID, message.timestamp, message.count, function(error) {
				if(error) {
					console.log(error.reason);
				}
			});
			return false;
		}

		if(message) {
			return (message.count - channel_Obj.lastRead_Count);
		} 

		return false;
	},
	active: function() {
		var channel = Session.get("channel");

		if(channel === "") {
			if (Session.get('recever') === this.User) {
            	return "active";
	        } else {
	            return "";
	        }
		} else {
			if (channel === this.valueOf()) {
            	return "active";
	        } else {
	            return "";
	        }
		}
	},
	emptyMsg: function() {
		var channel = Session.get("channel");
		var rcv = Session.get('recever');
		if(channel === "" && rcv ==="") {
			return true;
		} else {
			return false;
		}
	},
	search_Tag: function() {
		return Session.get("search_Tag");
	},
	messaging: function() {
		var messaging = Session.get("recever_details");
		var channel = Session.get("channel");

		if(messaging != null) {
			return messaging.Username;
		} else {
			if(channel !== "") {
				return channel;
			}
			return "Start a chat";
		}
	},
	to_target: function() {
		var channel = Session.get("channel");

		if(channel === "") {
			if(Session.get("recever") === "") {
				return "disabled";
			} else {
				return "";
			}
		} else {
			return "";
		}
	},
	formatTime: function(date) {
  		return moment(date).format('h.mm a');
  	}
});

Template.chatBoard.events({
	'click #startChat': function(e) {
		e.preventDefault();
		Session.set("searching", true);
		Session.set("recever", this.User);
		Session.set("recever_details", this);
		Session.set("channel", "");
		//Bring scrollbar to the bottom.
		Meteor.setTimeout((function() {
			updateScroll();
  		}), 500);
	},
	'click #searchBut': function(e) {
		e.preventDefault();
		var searchText = $('[name=search_query]').val().trim();

		if(searchText !== "") {
			Session.set("trigger", (!Session.get("trigger")));
			Session.set("search_Tag", true);
			Session.set("query", searchText);
			$('.nav-pills li:eq(1) a').tab('show');
		} else {
			return false;
		}
	},
	'keyup #search_query': function(e) {
		if(e.keyCode === 13) {
			$("#searchBut").click();
		}
	},
	'click #crossBut': function(e) {
		e.preventDefault();
		$('[name=search_query]').val("");
		Session.set("trigger", (!Session.get("trigger")));
		Session.set("search_Tag", false);
		Session.set("query", "");
	},
	'click #sendBtn' : function(e) {
		e.preventDefault();

		var channel = Session.get("channel");
		var to = Session.get("recever");
		var from = Session.get("sender");
		var msg = $("#type_msg").val();

		var details = {
			channel: channel,
			to: to,
			from: from,
			ts: new Date(),
			msg: msg
		}

		if(from === "" || msg === "") {
			return false;
		} else {
			if(to === "" || channel === "") {
				Meteor.call("newMessage", details, function(error, result) {
					if(error) {
						console.log(error.reason);
					} else {
						Meteor.call("addMessageCount", details);
						$("#type_msg").val("");
						updateScroll();
					}
				});
			} else {
				return false;
			}
		}
	},
	'keyup #type_msg': function(e) {
		if(e.keyCode === 13) {
			$("#sendBtn").click();
		}
	},
	'click #createChannel': function(e) {
		e.preventDefault();
		Session.set("searching", true);
		Session.set("recever", "");
		Session.set("recever_details", null);
		$('#create-channel-modal').modal('show');
	},
	'click #startChannel': function(e) {
		e.preventDefault();
		Session.set("searching", true);
		Session.set("recever", "");
		Session.set("recever_details", null);
		Session.set("channel", this.valueOf().trim());
		/*Credits: https://stackoverflow.com/questions/26147697/each-string-in-an-array-with-blaze-in-meteor*/
	},
	'click #myTabs' : function(e) {
		e.preventDefault();
		if(e.target.text !== 'Channel') {
			Session.set("channel", "");
			Session.set("chat_Channel", false);
		}
		$('#myTabs a[href="' + e.target.hash + '"]').tab('show');
	}
});

let updateScroll = () => {
  	/*https://stackoverflow.com/questions/18614301/keep-overflow-div-scrolled-to-bottom-unless-user-scrolls-up*/
	var dA = document.getElementById('chatArea');
	dA.scrollTop = dA.scrollHeight;
};