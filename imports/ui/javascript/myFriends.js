import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/myFriends.html';
import '../css/dashBoard.css';
import './users_GridView.js';

Template.myFriends.onCreated(function() {
  Meteor.subscribe("user_subscriptions", Meteor.userId());
});

Template.myFriends.helpers({
	subscribers: function() {
		var sub_list = Users.find({"User": Meteor.userId()}).fetch().map(function (obj) {return obj.FollowingList;});
		sub_list = _.flatten(sub_list);
		return Users.find({"User": {"$in" : sub_list}});
	}
});