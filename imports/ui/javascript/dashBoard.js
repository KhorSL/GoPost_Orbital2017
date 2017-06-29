import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/dashBoard.html';
import '../css/dashBoard.css';
import '../lib/fullcalendar.css';
import './calendar_full.js';

Template.dashBoard.onCreated(function() {
	Meteor.subscribe('userDetails_Cur', Meteor.userId());
});