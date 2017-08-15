import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/chat_channelModal.html';

Template.chat_channelModal.helpers({
	usr_events: function() {
		var events_id = Users.find({"User": Meteor.userId()}).fetch().map(function (obj) {return obj.CreatedEventList;});
		events_id = _.pluck(_.flatten(events_id), 'eventID');
		return Events.find({
			$and: [
			 	{"_id": {"$in" : events_id}},
				{ "channel" : {$ne: true}}
			]
		}).fetch();
	}
});

Template.chat_channelModal.events({
	'click #createChannel' :function(e) {
		/*https://stackoverflow.com/questions/10659097/jquery-get-selected-option-from-dropdown*/
		e.preventDefault();
		var channel_eid = $("#channel_name").val();
		var channel_title = $("#channel_name").find(":selected").text().trim();

		if(channel_eid != null) {
			Meteor.call("startChannel", Meteor.userId(), channel_eid, channel_title, true, function(error) {
				if(error) {
					console.log(error.reason);
				} else {
					closeModal();
				}
			});
		}
	}
});

let closeModal = () => {
  $('#create-channel-modal').modal('hide');
  $('.modal-backdrop').fadeOut();
};