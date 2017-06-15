import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';


import '../html/eventForm_Update.html';
import '../css/eventForm.css';

if(Meteor.isClient) {

	Template.eventForm_Update.helpers({
		ufMapOptions: function() {
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

	Template.eventForm_Update.onCreated(function() {
	  var output; // Output for image input
	  addr = "No address available"; // Global var... for location addr
	  geo = ""; // Global var... for location geometry

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
	});

	Template.eventForm_Update.onRendered(function() {
	  GoogleMaps.load({ v: '3', key: 'AIzaSyAjcdra9n9ZRlWG2M3ktzU6r_JLQP_Xm0I', libraries: 'geometry,places' });
	});

	Template.eventForm_Update.events({
		'submit .update-event': function(event) {
			var title = event.target.title.value;
			var description = event.target.description.value;
			var location = event.target.location.value;
			var locationAddr = addr;
			var locationGeo = geo;
			var dateTime = event.target.dateTime.value;
			var type = event.target.type.value;
			var privacy = event.target.privacy.checked;
			var contact = event.target.contact.value;
			
			
			console.log("Trying to update...");
			//Meteor.call("updateEvent", title, description, location, locationAddr, locationGeo, dateTime, type, privacy, contact, img);

			return false;
		}
	});
}