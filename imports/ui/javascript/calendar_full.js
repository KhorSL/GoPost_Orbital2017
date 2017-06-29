import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/calendar_full.html';
import '../css/dashBoard.css';
import '../lib/fullcalendar.css';
import './calendar_modal.js';

Template.calendar_full.onCreated(function() {
  let template = Template.instance();
  template.subscribe("events_Calendar_create", Meteor.userId());
  template.subscribe("events_Calendar_added", Meteor.userId()); //This is for user added events on calender
  /*Credits: https://themeteorchef.com/tutorials/reactive-calendars-with-fullcalendar*/
});

Template.calendar_full.onRendered(function() {

  /* initialize the calendar ------------------------------------*/
  $('#calendar').fullCalendar({
    header: { left: '', center: 'title', right: 'prev,today,month,agendaWeek,listWeek,next' },
    timezone:'local',
    eventLimit: true,
    eventLimitText: 3,
    forceEventDuration: true,

    //Event method to get EventObject from database
    events: function(start, end, timezone, callback) {
      
      var event_ids = Users.find({"User": Meteor.userId()}).map(function (obj) {return obj.CreatedEventList});
      event_ids = _.flatten(event_ids);

      let data1 = Events.find({"_id" : {$in : event_ids}}).fetch().map((event) => {
        event.editable = false;
        event.className = "label_cal label-default";
        return event;
      });

      let data2 = Cal_Events.find({"owner" : Meteor.userId()}).fetch().map((event) => {
        event.editable = !isPast(moment(event.start).format());
        event.className = event.className;
        return event;
      });

      let data = data1.concat(data2);

      if(data) {
        callback(data);
      }
    },

    eventDrop: function(event, delta, revert) {
      let date = event.start.format();

      if(event.allDay) {
        var defaultDuration = moment.duration($('#calendar').fullCalendar('option', 'defaultTimedEventDuration')); // get the default and convert it to proper type
        var end = event.end || event.start.clone().add(defaultDuration); // If there is no end, compute it
      } else {
        var defaultDuration = moment.duration($('#calendar').fullCalendar('option', 'defaultAllDayEventDuration')); // get the default and convert it to proper type
        var end = event.end || event.start.clone().add(defaultDuration); // If there is no end, compute it
      }
      /*Credits above: https://stackoverflow.com/questions/33746441/how-to-get-end-time-on-drop-and-eventdrop-with-external-elements-in-fullcalendar*/

      if (!isPast(date)) {
        let update = {
          _id: event._id,
          start: event.start.toDate(),
          end: event.end.toDate()
        };

        Meteor.call('moveCalendarEvents', update, function(error) {
          if ( error ) {
            console.log(error.reason);
          }
        });
      } else {
        revert();
        alert( 'Sorry, you can\'t move items to the past!');
      }
    },

    dayClick: function(date) {
      if(!isPast(date)) { //Disable editing of dates that have passed
        Session.set('calendarModal', {
          type: 'add',
          date: date.format()
        });
        $('#add-edit-calendar-modal').modal('show');
      }
    },
    eventClick: function(event) {
      if(event.editable) { //Disable to editing of created events
        Session.set('calendarModal', {
          type: 'edit',
          event: event._id
        });
        $('#add-edit-calendar-modal').modal('show');
      }
    },
    eventResize: function(event, delta, revertFunc) {
      let update = {
        _id: event._id,
        start: event.start.toDate(),
        end: event.end.toDate()
      };

      Meteor.call('moveCalendarEvents', update, function(error) {
        if ( error ) {
          console.log(error.reason);
        }
       });
    } 
  });

  Tracker.autorun( () => {
    Events.find().fetch();
    $('#calendar').fullCalendar('refetchEvents');
  });
});

let isPast = (date) => {
  let today = moment().format();
  return moment(today).isAfter(date);
};