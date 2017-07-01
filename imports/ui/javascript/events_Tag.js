import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/events_Tag.html';

Template.events_Tag.onCreated(function() {
    Meteor.subscribe('event_Tags');
});

Template.events_Tag.helpers({
	eventTags: function() {
		return Tags.find({},{tag: 1});
	},
});

Template.events_Tag.events({
	'click #tag_btn': function(e) {
		e.preventDefault();
		var selected_tag = e.target.name;
		Session.set("selected_tag", selected_tag);
		Session.set("searchQuery", "");						//Invalid Filter + Search to make way for Tag Search
		Session.set("selected_cat", "");					//Invalid cat Search to make way for Filter + Search
		Session.set("searching", true);
		Session.set("sButton", (!Session.get("sButton"))); //trigger the reactivity
	}
})