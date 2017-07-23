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

	template.sender = new ReactiveVar(Meteor.userId());
	template.recever = new ReactiveVar("");
	template.recever_details = new ReactiveVar(null);
	template.channel = new ReactiveVar("");
	template.trigger = new ReactiveVar(true); 		//for search bar
	template.search_Tag = new ReactiveVar(false); 	//for search bar
	template.query = new ReactiveVar(""); 			//for search bar
	template.searching = new ReactiveVar(false);
	Session.set("autoScrollingIsActive", true);
	Session.set("thereAreUnreadMessages", false);

	template.autorun( () => {
		var sender = template.sender.get();
		var recever = template.recever.get();
		var trig = template.trigger.get();
		var channel = template.channel.get();
    	
    	template.subscribe('conversation', sender, recever, channel, () => {
	      	setTimeout( () => {
	      		template.searching.set(false);
	      	}, 300 );
    	});
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
	delete Session.keys['chat_Target','chat_Channel',
	'autoScrollingIsActive','thereAreUnreadMessages'];
});

Template.chatBoard.helpers({
	channels: function() {
		var sender = Template.instance().sender.get();

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
		var sender = Template.instance().sender.get();
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
				Template.instance().recever.set(chatTgt.User);
				Template.instance().recever_details.set(chatTgt);
			}
		}

		return convo_with;
	},
	msgHistory: function() {
		var sender = Template.instance().sender.get();
		var recever = Template.instance().recever.get();
		var channel = Template.instance().channel.get(); 

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
		if(Template.instance().search_Tag.get()) {
			var sq = Template.instance().query.get();
			var regex = new RegExp(sq,'i');
			return Users.find({"Username": regex}).fetch();
		} else {
			var sender = Template.instance().sender.get();
			var sub_list = Users.find({"User": Meteor.userId()}).fetch().map(function (obj) {return obj.FollowingList;});
			sub_list = _.flatten(sub_list);
			return Users.find({"User": {"$in" : sub_list}}).fetch();
		}
	},
	msgCount: function() {
		var sender = Template.instance().sender.get();
		var recever = Template.instance().recever.get();
		var chatID = this.User;

		if(recever === chatID) {
			//setting Message Count to 0 if user reads the message.
			Meteor.call("emptyMessageCount", sender, chatID, function(error) {
				if(error) {
					//console.log(error.reason);
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
		var sender = Template.instance().sender.get();
		var channel = Template.instance().channel.get();
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
					//console.log(error.reason);
				}
			});
			return false;
		}

		if(message) {
			return (message.count - channel_Obj.lastRead_Count);
		} 

		return false;
	},
	thereAreUnreadMessages: function() {
		return Session.get("thereAreUnreadMessages");
	},
	active: function() {
		var channel = Template.instance().channel.get(); 

		if(channel === "") {
			if (Template.instance().recever.get() === this.User) {
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
		var channel = Template.instance().channel.get(); 
		var rcv = Template.instance().recever.get();
		if(channel === "" && rcv ==="") {
			return true;
		} else {
			return false;
		}
	},
	search_Tag: function() {
		return Template.instance().search_Tag.get();
	},
	messaging: function() {
		var messaging = Template.instance().recever_details.get(); 
		var channel = Template.instance().channel.get(); 

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
		var channel = Template.instance().channel.get(); 

		if(channel === "") {
			if(Template.instance().recever.get() === "") {
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
	'click #startChat': function(e, tmp) {
		e.preventDefault();
		tmp.searching.set(true);
		tmp.recever.set(this.User);
		tmp.recever_details.set(this);
		tmp.channel.set("");
		//Bring scrollbar to the bottom.
		Meteor.setTimeout((function() {
			updateScroll();
  		}), 500);
	},
	'click #searchBut': function(e, tmp) {
		e.preventDefault();
		var searchText = $('[name=search_query]').val().trim();

		if(searchText !== "") {
			tmp.trigger.set(!tmp.trigger.get());
			tmp.search_Tag.set(true);
			tmp.query.set(searchText);
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
	'click #crossBut': function(e, tmp) {
		e.preventDefault();
		$('[name=search_query]').val("");
		tmp.trigger.set(!tmp.trigger.get());
		tmp.search_Tag.set(false);
		tmp.query.set("");
	},
	'scroll #chatArea': function(e, tmp) {
		//https://github.com/meteor/chat-tutorial/blob/master/chat-tutorial-part-4.md#make-a-scrolltobottom-function
		var howClose = 80;  // # pixels leeway to be considered "at Bottom"
	    var messageWindow = $("#chatArea");
	    var scrollHeight = messageWindow.prop("scrollHeight");
	    var scrollBottom = messageWindow.prop("scrollTop") + messageWindow.height();
	    var atBottom = scrollBottom > (scrollHeight - howClose);

	    if(atBottom) {
	    	Session.set("autoScrollingIsActive", true);
			Session.set("thereAreUnreadMessages", false);
	    } else {
	    	Session.set("autoScrollingIsActive", false);
	    }
	},
	'click .more-messages': function(e) {
		e.preventDefault();
		Session.set("autoScrollingIsActive", true);
		Session.set("thereAreUnreadMessages", false);
		updateScroll();
	},
	'click #sendBtn' : function(e, tmp) {
		e.preventDefault();

		var channel = tmp.channel.get();
		var to = tmp.recever.get(); 
		var from = tmp.sender.get();
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
						//console.log(error.reason);
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
	'click #createChannel': function(e, tmp) {
		e.preventDefault();
		tmp.searching.set(true);
		tmp.recever.set("");
		tmp.recever_details.set(null);
		$('#create-channel-modal').modal('show');
	},
	'click #startChannel': function(e, tmp) {
		e.preventDefault();
		tmp.searching.set(true);
		tmp.recever.set("");
		tmp.recever_details.set(null);
		tmp.channel.set(this.valueOf().trim());
		/*Credits: https://stackoverflow.com/questions/26147697/each-string-in-an-array-with-blaze-in-meteor*/
		//Bring scrollbar to the bottom.
		Meteor.setTimeout((function() {
			updateScroll();
  		}), 500);
	},
	'click #myTabs' : function(e, tmp) {
		e.preventDefault();
		if(e.target.text !== 'Channel') {
			tmp.channel.set("");
			Session.set("chat_Channel", false);
		}
		$('#myTabs a[href="' + e.target.hash + '"]').tab('show');
	}
});

let updateScroll = () => {
  	/*https://stackoverflow.com/questions/18614301/keep-overflow-div-scrolled-to-bottom-unless-user-scrolls-up*/
	if(Session.get("autoScrollingIsActive")) {
		var dA = document.getElementById('chatArea');
		dA.scrollTop = dA.scrollHeight;
	} else {
		Session.set("thereAreUnreadMessages", true);
	}
};