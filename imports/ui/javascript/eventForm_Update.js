import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/eventForm_Update.html';
import '../css/eventForm.css';

if(Meteor.isClient) {

	Template.eventForm_Update.helpers({
		ufMapOptions: function() {
			// Make sure the maps API has loaded
			if (GoogleMaps.loaded()) {
				var currEvent = Events.findOne({_id: this._id});
				addr = "No address available"; // Global var... for location addr
				geo = []; // Global var... for location geometry

				// Map initialization options
				if(currEvent.locationGeo != null) {
					addr = currEvent.locationAddr;
					geo = [currEvent.locationGeo[0], currEvent.locationGeo[1]];
					return {
						center: new google.maps.LatLng(currEvent.locationGeo[0], currEvent.locationGeo[1]),
						zoom: 18
					};
				} else {
					return {
						center: new google.maps.LatLng(34, 52),
						zoom: 15
					};
				}
			}
		},

		formatDate: function(date) {
  			return moment(date).format('MM/DD/YYYY h:mm A');
  		},

  		catSelection: function(selected) {
			var currEvent = Events.findOne({_id: this._id});
  			if(selected === currEvent.category) {
  				return true;
  			} else {
  				return false;
  			}
  		}
	});

	Template.eventForm_Update.onRendered(function() {
		//Datetimepicker verification
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

		var output; // Output for image input

		// We can use the `ready` callback to interact with the map API once the map is ready.
		GoogleMaps.ready('ufMap', function(map) {
		  // Add a marker to the map once it's ready
		  var markers = [];
		  markers.push(new google.maps.Marker({
		    position: map.options.center,
		    map: map.instance
		  }));

	    	// Create the search box and link it to the UI element
	    	var input = document.getElementById('pac-input');
  			var searchBox = new google.maps.places.SearchBox(input);
  			GoogleMaps.maps.ufMap.instance.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
	    
  			// Bias the searchBox results towards current map's viewport
  			GoogleMaps.maps.ufMap.instance.addListener('bounds_changed', function() {
	    		searchBox.setBounds(GoogleMaps.maps.ufMap.instance.getBounds());
	    	});

  			searchBox.addListener('places_changed', function() {			
  				var places = searchBox.getPlaces();
  				addr = places[0].formatted_address;

  				if(places.length == 0) {
  					console.log("No place input");
  					return;
  				}

  				// Clearing out of old markers
  				markers.forEach(function(marker) {
  					marker.setMap(null);
  				});
  				markers = [];

  				// For each place, get the name and location.
  				var bounds = new google.maps.LatLngBounds();

  				places.forEach(function(place) {
  					if(!place.geometry) {
  						console.log("Returned place contains no geometry");
  						return;
  					}

  					geo = [place.geometry.location.lat(), place.geometry.location.lng()];

  					// Create a marker for the new place
		    	  	markers.push(new google.maps.Marker( {
				      	map: map.instance,
				      	title: place.name,
				      	position: place.geometry.location
				     }));

  					if(place.geometry.viewport) {
  						bounds.union(place.geometry.viewport);
  					} else {
  						bounds.extend(place.geometry.location);
  					}
  				});
  				// Self note: can be replaced by map.fitbounds.
  				GoogleMaps.maps.ufMap.instance.fitBounds(bounds);				
  			});
	  });

	 	GoogleMaps.load({ v: '3', key: 'AIzaSyAjcdra9n9ZRlWG2M3ktzU6r_JLQP_Xm0I', libraries: 'geometry,places' });
	 	// For tags input
		$('#tokenfield').tokenfield();
		//Boostrap datetimepicker
		$('.datetimepicker').datetimepicker();
	});

	Template.eventForm_Update.events({
		'submit .update-event': function(event) {
			var title = event.target.title.value;
			var description = event.target.description.value;
			var location = event.target.location.value;
			var locationAddr = addr;
			var locationGeo = geo;
			var venue = event.target.venue.value;
			var start = event.target.start.value;
			var end = event.target.end.value;
			var signUpDeadline = event.target.signUpDeadline.value;
			var category = $("#event_cat").val();
			var type = $('#tokenfield').val().split();
			var contact = event.target.contact.value;
			var img = output.src;
			var eventId = this._id;

			Meteor.call("updateEvent", eventId, title, description, location, locationAddr, locationGeo, venue, start, end, signUpDeadline, category, type, contact, img, function(error, result) {
				if(error) {
					console.log(error.reason);
				} else {
					Router.go('event_View', { _id: eventId});
				}
			});
		},

		'change .img-input': function(event) {
			event.preventDefault();
			var input = event.target;
			var reader = new FileReader();
			reader.onload = function() {
				var dataURL = reader.result;
				output = document.getElementById('output');
				output.src = dataURL;
			};
			if(input.files[0] != null) {
				reader.readAsDataURL(input.files[0]);
			} else {
				output.src = "";
				return false;
			}
		}
	});
}