import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/calendar_modal.html';
import '../css/dashBoard.css';
import '../lib/fullcalendar.css';

Template.calendar_modal.onCreated(function() {
  Session.set('allDay', false);
});

Template.calendar_modal.onRendered(function() {
  var dateToday = new Date();

  $('#datetimepicker_start').datetimepicker({
    minDate: dateToday,
    calendarWeeks: true
  });
  $('#datetimepicker_end').datetimepicker({
    minDate: dateToday.setHours(dateToday.getHours() + 1),
    useCurrent: false //Important! See issue #1075
  });
  $("#datetimepicker_start").on("dp.change", function (e) {
    $('#datetimepicker_end').data("DateTimePicker").minDate(e.date.add(30,'m'));
  });
  $("#datetimepicker_end").on("dp.change", function (e) {
    $('#datetimepicker_start').data("DateTimePicker").maxDate(e.date);
  });
});

Template.calendar_modal.helpers({
  modalType: function(type) {
    let calendarModal = Session.get('calendarModal');
    if ( calendarModal ) {
      	return calendarModal.type === type;
    }
  },
  modalLabel: function() {
    let calendarModal = Session.get('calendarModal');

    if ( calendarModal ) {
      return {
        button: calendarModal.type === 'edit' ? 'Edit' : 'Add',
        label: calendarModal.type === 'edit' ? 'Edit' : 'Add an'
      };
    }
  },
  event: function() {
    let calendarModal = Session.get('calendarModal');

    if ( calendarModal ) {
      if(calendarModal.type === 'edit') {
        var event_item = Cal_Events.findOne(calendarModal.event);
        
        if(event_item) {
          Session.set("allDay", event_item.allDay);
          return event_item;
        } 
        return false;
      } else {
        var event_item = {
          start: moment(calendarModal.date).format(),  
          end: moment(calendarModal.date).add(1, 'hour').format()
        }
        return event_item;
      }
    }
    return false;
  },
  checked: function() {
    var allDay = Session.get('allDay');

    if(allDay){
      return "checked";
    } else {
      return "";
    }
  }
});

Template.calendar_modal.events({
  'submit #add-edit-calendar-form': function (event) {
    event.preventDefault();
    /*https://stackoverflow.com/questions/17642754/fullcalendar-date-differs-when-stored-and-retrieved-from-database*/

    let calendarModal = Session.get('calendarModal') , 
      submitType = calendarModal.type === 'edit' ? 'editCalendarEvents' : 'addCalendarEvents',
        calendarItem  = {
          title: event.target.cal_title.value,    //template.find( '[name="title"]' ).value
          start: event.target.cal_start.value,    //template.find( '[name="start"]' ).value
          end: event.target.cal_end.value,        //template.find( '[name="end"]' ).value
          allDay: event.target.cal_allDaY.checked,
          className: event.target.priority.value,
          notes: event.target.cal_notes.value  //template.find( '[name="notes"]' ).value
        };

    if ( submitType === 'editCalendarEvents' ) {
      calendarItem._id = calendarModal.event;
    }

    Meteor.call(submitType, calendarItem, function(error, result) {
      if ( error ) {
        console.log( error.reason);
      } else {
        closeModal();
      }
    });
    return false;
  },

  'click .delete-event': function(e) {
    e.preventDefault();
    let calendarModal = Session.get('calendarModal');
    if(confirm('Are you sure you want to delete?')) {
      Meteor.call('delCalendarEvents', calendarModal.event, function(error) {
        if(error) {
          console.log(error.reason);
        } else {
          closeModal();
        }
      });
    }
  },

  'change #allDaY': function(e) {
    e.preventDefault();
    //Unable to work
    /*
    if(e.target.checked) {
      console.log("CHECKED");
      $('#datetimepicker_start').datetimepicker({format: 'l'});
      $('#datetimepicker_end').datetimepicker({format: 'l'});
    } else {
      $('#datetimepicker_start').datetimepicker({format: 'llll'});
      $('#datetimepicker_end').datetimepicker({format: 'llll'});
    }*/
  }
});

let closeModal = () => {
  $('#add-edit-calendar-modal').modal('hide');
  $('.modal-backdrop').fadeOut();
};