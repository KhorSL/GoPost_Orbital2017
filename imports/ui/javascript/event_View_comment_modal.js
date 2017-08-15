import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/event_View_comment_modal.html';

Template.event_View_comment_modal.events({
	'click #replyBtn' :function(e) {
		e.preventDefault();
		var msg = $("#reply_msg").val();
		var originalPost = Session.get("originalPost");

		Meteor.call("newComment_Reply", Meteor.userId(), msg, this._id, originalPost);
		$("#reply_msg").val("");
		closeModal();
	},
});

let closeModal = () => {
  $('#reply-comment-modal').modal('hide');
  $('.modal-backdrop').fadeOut();
};