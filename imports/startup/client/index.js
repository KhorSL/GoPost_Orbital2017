import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

//Import default Materials.
import '/imports/ui/lib/bootstrap.css';
import '/imports/ui/lib/bootstrap-tokenfield.css';
import '/imports/ui/lib/fullcalendar.css';
import '/imports/ui/lib/bootstrap-datetimepicker.css';

//Import to load templates
import '/imports/ui/javascript/aboutUs.js';
import '/imports/ui/javascript/advertisement.js';
import '/imports/ui/javascript/bulletinBoard.js';
import '/imports/ui/javascript/calendar_full.js';
import '/imports/ui/javascript/calendar_modal.js';
import '/imports/ui/javascript/chatBoard.js';
import '/imports/ui/javascript/chat_messageView.js';
import '/imports/ui/javascript/dashBoard.js';
import '/imports/ui/javascript/event_View.js';
import '/imports/ui/javascript/events_User.js';
import '/imports/ui/javascript/events_General.js';
import '/imports/ui/javascript/events_StickyView.js';
import '/imports/ui/javascript/events_Tag.js';
import '/imports/ui/javascript/eventForm_Create.js';
import '/imports/ui/javascript/eventForm_Update.js';
import '/imports/ui/javascript/messageBoard.js';
import '/imports/ui/javascript/myBoard.js';
import '/imports/ui/javascript/myEvents.js';
import '/imports/ui/javascript/myFriends.js';
import '/imports/ui/javascript/landing.js';
import '/imports/ui/javascript/layout.js';
import '/imports/ui/javascript/loginPage.js';
import '/imports/ui/javascript/registerPage.js';
import '/imports/ui/javascript/settings.js';
import '/imports/ui/javascript/eventForm_RegistrationForm.js';
import '/imports/ui/javascript/eventForm_signUp.js';

//Import to load routes
import './routes/routes.js';