import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/eventForm_Create.html';
import '../css/eventForm.css';

/*========= FSCollection with cfs:grid ======
Images = new FS.Collection('Images', {
	stores: [new FS.Store.GridFS('Images')],
		filter: {
			allow: {
				contentTypes: ['image/*']
			},
			onInvalid: function(message) {
				FlashMessage.sendError(message);
			}
		}
});

Images.allow({
	insert: function(){ return true;},
	update: function(){ return true;},
	download: function(){ return true;},
})
===========================================*/

if(Meteor.isClient) {

	Template.eventForm_Create.helpers({
		/*
		images: function() {
			return Images.find();
		},
		*/
		exampleMapOptions: function() {
	    // Make sure the maps API has loaded
	    if (GoogleMaps.loaded()) {
	    	// Map initialization options
	    	return {
	    		center: new google.maps.LatLng(1.3521, 103.8198),
	    		zoom: 10
	    	};
	    }
	  }
	});

	Template.eventForm_Create.onCreated(function() {

	  var output; // Output for image input
	  addr = "No address available"; // Global var... for location addr
	  geo = ""; //Global var.. for location geometry

	  // We can use the `ready` callback to interact with the map API once the map is ready.
	  GoogleMaps.ready('exampleMap', function(map) {
	    // Add a marker to the map once it's ready
	    var markers = [];
	    markers.push(new google.maps.Marker({
	      position: map.options.center,
	      map: map.instance
	    }));

	    // Create the search box and link it to the UI element
	    var input = document.getElementById('pac-input');
  		var searchBox = new google.maps.places.SearchBox(input);
  		GoogleMaps.maps.exampleMap.instance.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
	    
  		// Bias the searchBox results towards current map's viewport
  		GoogleMaps.maps.exampleMap.instance.addListener('bounds_changed', function() {
	    	searchBox.setBounds(GoogleMaps.maps.exampleMap.instance.getBounds());
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
  				geo = place.geometry;

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
  			GoogleMaps.maps.exampleMap.instance.fitBounds(bounds);				
  		});
	  });
	});

	Template.eventForm_Create.onRendered(function() {
	  GoogleMaps.load({ v: '3', key: 'AIzaSyAjcdra9n9ZRlWG2M3ktzU6r_JLQP_Xm0I', libraries: 'geometry,places' });
	
	  $('#tokenfield').tokenfield();
	  $('.datetimepicker').datetimepicker();
	});

	Template.eventForm_Create.events({
		'submit .new-event': function(event) {
			event.preventDefault();

			var title = event.target.title.value;
			var description = event.target.description.value;
			var location = event.target.location.value;
			var locationAddr = addr;
			var locationGeo = geo;
			var start = event.target.start.value;
			var end = event.target.end.value;
			var type = $('#tokenfield').val().split(',');
			var privacy = event.target.privacy.checked;
			var contact = event.target.contact.value;
			var img = output.src;

			start = new Date(start);
			end = new Date(end);

			var rf_description = event.target.rf_description.checked;
			var rf_name = event.target.rf_name.checked;
			var rf_contact_mobile = event.target.rf_contact_mobile.checked;
			var rf_contact_email = event.target.rf_contact_email.checked;
			var rf_address_full = event.target.rf_address_full.checked;
			var rf_address_region = event.target.rf_address_region.checked;
			var rf_shirtSize_sml = event.target.rf_shirtSize_sml.checked;
			var rf_shirtSize_123 = event.target.rf_shirtSize_123.checked;
			var rf_shirtSize_chart = event.target.rf_shirtSize_chart.checked;
			var rf_nationality = event.target.rf_nationality.checked;
			var rf_gender = event.target.rf_gender.checked;
			var rf_dietaryPref = event.target.rf_dietaryPref.checked;
			var rf_allergies = event.target.rf_allergies.checked;
			var rf_bloodType = event.target.rf_bloodType.checked;
			var rf_faculty = event.target.rf_faculty.checked;
			var rf_major = event.target.rf_major.checked;
			var rf_nokInfo = event.target.rf_nokInfo.checked;
			var rf_additional = event.target.rf_additional.checked;
			var rf_matric = event.target.rf_matric.checked;
			var rf_nric = event.target.rf_nric.checked;
			
			Meteor.call("addEvent", title, description, location, locationAddr, locationGeo, start, end, type, privacy, contact, img, function(error, result) {
				if(error) {
					console.log(error.reason);
				} else {
					Meteor.call("addEventTag", type);
					Meteor.call("addRegistrationForm", result, title, rf_description, rf_name, rf_contact_mobile, rf_contact_email, rf_address_full, rf_address_region, rf_shirtSize_sml, rf_shirtSize_123, rf_shirtSize_chart, rf_nationality, rf_gender, rf_dietaryPref, rf_allergies, rf_bloodType, rf_faculty, rf_major, rf_nokInfo, rf_additional, rf_matric, rf_nric);
					Meteor.call("addEvent_User", result, function(error2, result2) {
						if(error2) {
							console.log(error2.reason);
						}
					});
					Router.go('event_View', { _id: result});
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
			reader.readAsDataURL(input.files[0]);
			
			/****************************************
			FS.Utility.eachFile(event, function(file){
				var newFile = new FS.File(file);
				console.log(newFile);
				//Meteor.call("addImage", newFile);
			});
			*****************************************/
		},

		'click .previous': function(event){
			event.preventDefault();
			
			var current_fs, next_fs, previous_fs; //fieldsets
			var left, opacity, scale; //fieldset properties which we will animate
			var animating; //flag to prevent quick multi-click glitches

			if(animating) return false;
			animating = true;
			
			current_fs = $(event.target).parent();
			previous_fs = $(event.target).parent().prev();
			
			//de-activate current step on progressbar
			$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
			
			//show the previous fieldset
			previous_fs.show();
			
			//hide current fieldset
			current_fs.hide();
			animating = false;
		},

		'click .next': function(event){
			event.preventDefault();
			var current_fs, next_fs, previous_fs; //fieldsets
			var left, opacity, scale; //fieldset properties which we will animate
			var animating; //flag to prevent quick multi-click glitches
			
			if(animating) return false;
			animating = true;

			current_fs = $(event.target).parent();
			next_fs = $(event.target).parent().next();

			//activate next step on progressbar using the index of next_fs
			$("#progressbar li").eq($("fieldset").index(next_fs)).addClass('active');

			//show the next fieldset
			next_fs.show();

			//hide the current fieldset with style
			current_fs.hide();
			animating = false;
			
		}
	});
}