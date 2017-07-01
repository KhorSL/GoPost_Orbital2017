import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/loader.html';
import '../html/chatBoard.html';
import '../css/chatBoard.css';
import './chat_messageView.js';

/*Credits:
https://bootsnipp.com/snippets/vrzGb
https://codepen.io/drehimself/pen/KdXwxR
https://bootsnipp.com/snippets/33ejn
https://bootsnipp.com/snippets/EkQe7
*/

Template.chatBoard.onCreated(function() {
	let template = Template.instance();

	Meteor.subscribe("channels");

	Session.set("sender", Meteor.userId());
	Session.set("recever", "");
	Session.set("trigger", true); 			//for search bar
	Session.set("search_Tag", false); 		//for search bar
	Session.set("query", ""); 				//for search bar

	template.autorun( () => {
		console.log("INSIDE AUTORUN");
		var sender = Session.get("sender");
		var recever = Session.get("recever");
		var trig = Session.get("trigger");
    	
    	template.subscribe('conversation', sender, recever, () => {
	      	setTimeout( () => {
	        	Session.set("searching", false);	//template.searching.set( false );
	      	}, 300 );
    	});

    	template.subscribe('userDetails_All', trig);
  	});
});

Template.chatBoard.helpers({
	channel: function() {
		return Channels.find().fetch();
	},
	convos: function() {
		var sender = Session.get("sender");
		var convo_list = Messages.find({"owner" : sender}).fetch().map(function (obj) {return obj.to;});
		var convo_list2 = Messages.find({"to" : sender}).fetch().map(function (obj) {return obj.owner;});

		convo_list = _.uniq(convo_list.concat(convo_list2));
		return Users.find({"User": {"$in" : convo_list}});
	},
	messages: function() {
		var sender = Session.get("sender");
		var recever = Session.get("recever");

		return Messages.find(
			{$or: [
				{ $and: [ {"owner" : sender}, {"to" : recever} ] },
				{ $and: [ {"owner" : recever}, {"to" : sender} ] }
			]
		});
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
	active: function() {
		if (Session.get('sender') === this.valueOf()) {
            return "active";
        } else {
            return "";
        }
	},
	search_Tag: function() {
		return Session.get("search_Tag");
	},
	to_target: function() {
		if(Session.get("recever") === "") {
			return "disabled";
		} else {
			return "";
		}
	}
});

Template.chatBoard.events({
	'click #startChat': function(e) {
		e.preventDefault();
		Session.set("searching", true);
		Session.set("recever", this.User);
		//Session.set("recever", this.valueOf());
		/*Credits: https://stackoverflow.com/questions/26147697/each-string-in-an-array-with-blaze-in-meteor*/
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
	'click #crossBut': function(e) {
		e.preventDefault();
		$('[name=search_query]').val("");
		Session.set("trigger", (!Session.get("trigger")));
		Session.set("search_Tag", false);
		Session.set("query", "");
	},
	'click #sendBtn' : function(e) {
		e.preventDefault();

		var to = Session.get("recever");
		var from = Session.get("sender");
		var msg = $("#type_msg").val();

		var details = {
			channel: "",
			to: to,
			from: from,
			msg: msg
		}

		if(to === "" || from === "" || msg === "") {
			return false;
		} else {
			Meteor.call("newMessage", details, function(error, result) {
				if(error) {
					console.log(error.reason);
				} else {
					$("#type_msg").val("");
				}
			});
		}
	}
});