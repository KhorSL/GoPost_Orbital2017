import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/event_View_CommentBox.html';
import './event_View_comment_modal.js';

Template.event_View_CommentBox.helpers({
	comments: function() {
		return Comments.find({"eventID": this._id, "originalPostID": null}, {sort: {timestamp: -1}});
	}
});

Template.event_View_CommentBox.events({
	'click #sendBtn' :function(e) {
		e.preventDefault();
		var msg = $("#type_msg").val();
		Meteor.call("newComment", Meteor.userId(), msg, this._id);
		$("#type_msg").val("");
	}
});

Template.event_View_Comment_Detail.helpers({
	commentAvatar: function() {
		return Users.findOne({"User": this.postID}).profilePic;
	},
	commentUser: function() {
		return Users.findOne({"User": this.postID}).Username;
	},
	duration: function(commentDate) {
		var now = new Date();
		var diff = (now.getTime() - commentDate.getTime()) / (24*1000*60*60); //get the days	

		if(diff < 7) {
			return moment(commentDate).format('Do MMM YYYY, h.mm a');
		} else {
			var numOfWeeks = diff / 7;
			if(numOfWeeks < 4) {
				return (numOfWeeks + " weeks ago");
			} else {
				var numOfMonths = numOfWeeks / 4;
				if(numOfMonths < 12) {
					return (numOfMonths + " months ago");
				} else {
					var numOfYears = numOfMonths / 12;
					return (numOfYears + " years ago");
				}
			}
		}
	},
	replies: function() {
		return Comments.find({"originalPostID": this._id});
	},
	isOwner3: function() {
		/*https://stackoverflow.com/questions/29900541/how-do-i-properly-scope-nested-each-spacebars-iterators-when-using-meteor*/
    	var owner = Template.parentData(2).owner;
    	return owner === Meteor.userId();
	}
});

Template.event_View_Comment_Detail.events({
	'click .reply_button' :function(e) {
		e.preventDefault();
		Session.set("originalPost", this._id);
		$('#reply-comment-modal').modal('show');
	},
	'click .reply_button2' :function(e) {
		e.preventDefault();
		Session.set("originalPost", this.originalPostID);
		$('#reply-comment-modal').modal('show');
	}
});

Template.event_View_Comment_Detail.onDestroyed(function() {
	delete Session.keys['originalPost'];
});