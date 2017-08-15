import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/event_View_CommentBox.html';
import './event_View_comment_modal.js';

Template.event_View_CommentBox.onCreated(function() {
	Session.set("limit", 20);
});

Template.event_View_CommentBox.onRendered(function() {
	var lastScrollTop = 0;

  	$(window).scroll(function(event) {
    	if($(window).scrollTop() + $(window).height() > $(document).height() - 100) { // to detect scroll event
      		var scrollTop = $(this).scrollTop();

      		if(scrollTop > lastScrollTop){ // detect scroll down
      			Session.set("limit", (Session.get("limit")+15)); // when it reaches the end, add another 9 elements
      		}

      		lastScrollTop = scrollTop;
   		}
 	});
 	/*Auto Detect Scrolling Credits:
	http://www.meteorpedia.com/read/Infinite_Scrolling
	https://stackoverflow.com/questions/38739335/infinite-scrolling-with-meteor
	https://stackoverflow.com/questions/4306387/jquery-add-and-remove-window-scrollfunction
 	*/
 });

Template.event_View_CommentBox.helpers({
	comments: function() {
		var limit = Session.get("limit");
		return Comments.find({"eventID": this._id, "originalPostID": null}, {sort: {timestamp: -1}, limit: limit});
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
	$(window).off("scroll");
	delete Session.keys['originalPost', "limit"];
});