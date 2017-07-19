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
		var output = ""; // Output for image input
	  addr = "No address available"; // Global var... for location addr
	  geo = []; //Global var.. for location geometry

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
  			GoogleMaps.maps.exampleMap.instance.fitBounds(bounds);				
  		});
	  });
	});

	Template.eventForm_Create.onRendered(function() {
		//Limiting the number of question user can add
		maxFields = 25;
		currFields = 0;

		//Adding the first field to the custom form
		if(currFields >= maxFields) {
				alert("You have reached the maximum number of fields you can add. Please consider to revise your Registration Form. Thank you.");
				return false;
		}

		var intId = $("#buildyourform div").length + 1;
		var qnsWrapper = $("<div class=\"qnswrapper\" id=\"field" + intId + "\"/>");

		var qnsHeader = $("<div class=\"qnsheader row form-group\" id=\"qHeader" + intId + "\"/>");
		var qnsName = $("<div class=\"col-sm-8\"><label>Field Title</label><input type=\"text\" class=\"qnsname form-control\"></div>");
		var qnsType = $("<div class=\"col-sm-4\"><label>Field Type</label><select class=\"qnstype form-control\" onchange=\"fieldTypeChange(this);\"><option value=\"checkbox\">Check Boxes</option><option value=\"mcq\">Multiple Choices</option><option value=\"textbox\" selected=\"selected\">Text</option><option value=\"textarea\">Paragraph</option></select></div>");

		var qnsBody = $("<div class=\"qnsbody row form-group\" id=\"qBody" + intId + "\"/>");
		var qnsDisplay = $("<div class=\"col-sm-12\" id=\"fDisplay" + intId + "\"> </div>");

		var qnsFooter = $("<div class=\"qnsfooter row form-group\" id=\"qFooter" + intId + "\"/>");
		var qnsRemoveButton = $("<div class=\"col-sm-1 pull-right\"><span role=\"button\" class=\"remove glyphicon glyphicon-trash\"></span></div>");
		var qnsAddButton = $("<div class=\"col-sm-1 pull-left\"><span role=\"button\" class=\"remove glyphicon glyphicon-plus\" id=\"add\"></span></div>");

		currFields++;

		qnsRemoveButton.click(function() {
			if(currFields <= 1) {
				alert("You need to include at least 1 question in your Registration Form. Thank you.");
				return false;
			}

		    $(this).parent().parent().remove();
		    currFields--;
		});

		qnsHeader.append(qnsName);
		qnsHeader.append(qnsType);

		qnsBody.append(qnsDisplay);

		qnsFooter.append(qnsRemoveButton);
		qnsFooter.append(qnsAddButton);

		qnsWrapper.append(qnsHeader);
		qnsWrapper.append(qnsBody);
		qnsWrapper.append(qnsFooter);

		$("#buildyourform").append(qnsWrapper);
		

		//Selection of custom form field changed function
		fieldTypeChange = function (selected) {
			var ft = $(selected).val(); //Field type
			var qHeaderId = $(selected).parent().parent().attr('id').replace("qHeader", ""); //Question Header ID
			var qnsDp = "fDisplay" + qHeaderId; //The id of the div to display the various type of question options

			//option fields
			var optWrapper = $("<div class=\"optWrapper row form-group\" id=\"optWrapper" + qHeaderId + "\"/>");
			var optAddButton = $("<div class=\"col-sm-3\" id=\"add" + optId + "\"><input type=\"button\" class=\"optAdd btn btn-default\" value=\"Add Options\"></div>");
			//initial option field ID
			var optId = 1;
			//Option fields as a wrapper; include a remove button and an add button
			var optUserFields = $("<div class=\"col-sm-9\"/>");
			var optEachUF = $("<div class=\"row eachUF\"/>");
			var optFields = $("<div class=\"col-sm-10\" id=\"optionField" + optId + "\"><input type=\"text\" class=\"optname form-control\" value=\"Option " + optId + "\"/>");
			var optRemoveButton = $("<div class=\"col-sm-2\" id=\"remove" + optId + "\"><input type=\"button\" class=\"optRemove btn btn-default\" value=\"-\"></div>");
			
			optEachUF.append(optFields);
			optEachUF.append(optRemoveButton);
			optUserFields.append(optEachUF);

			optAddButton.click(function() {
				if(optId > 15) {
					return false;
				}

				optId++;
				var optEachUF = $("<div class=\"eachUF row\"/>");
				var optFields = $("<div class=\"col-sm-10\" id=\"optionField" + optId + "\"><input type=\"text\" class=\"optname form-control\" value=\"Option " + optId + "\"/>");
				var optRemoveButton = $("<div class=\"col-sm-2\" id=\"remove" + optId + "\"><input type=\"button\" class=\"optRemove btn btn-default\" value=\"-\"></div>");
			
				optRemoveButton.click(function() {
					if(optId <= 1) {
						return false;
					}

			    	$(this).parent().remove();
			    	optId--;
				});

				optEachUF.append(optFields);
				optEachUF.append(optRemoveButton);

				optUserFields.append(optEachUF);
			});	

			optWrapper.append(optAddButton);

			optRemoveButton.click(function() {
				if(optId <= 1) {
					return false;
				}

			    $(this).parent().remove();
			    optId--;
			});		

			optWrapper.append(optUserFields);


			if(ft === 'mcq') {
				$("#" + "optWrapper" + qHeaderId).remove();
				$("#"+qnsDp).append(optWrapper);
			} else if(ft === 'checkbox') {
				$("#" + "optWrapper" + qHeaderId).remove();
				$("#"+qnsDp).append(optWrapper);
			} else {
				$("#" + "optWrapper" + qHeaderId).remove();
			}
		};
		//Google Map API
		GoogleMaps.load({ v: '3', key: 'AIzaSyAjcdra9n9ZRlWG2M3ktzU6r_JLQP_Xm0I', libraries: 'geometry,places' });
		//Tags-input
		$('#tokenfield').tokenfield();
		//Boostrap datetimepicker
		$('.datetimepicker').datetimepicker();
		// Validator
		var validator = $("#new-event").validate({
  			rules: {
  			  title: "required",
  			  description: "required",
  			  location: "required",
  			  start: "required",
  			  end: "required",
  			  contact: "required",
  			  type: "required"
  			},
  			groups: {
			  duration: "start end"
			},
			errorPlacement: function(error, element) {
			  if (element.attr("name") == "start" || element.attr("name") == "end" ) {
			    error.insertAfter("#end");
			  } else {
			    error.insertAfter(element);
			  }
			},
			messages: {
				title: "Please specify event title",
				description: "Please enter description",
				location: "Please specify the location",
				start: "Please specify start date",
				end: "Please specify end date",
				contact: "Please enter contact details",
				type: "Please specify event type"
  			}
  		});
	});

	Template.eventForm_Create.events({
		'submit .new-event': function(event) {
			event.preventDefault();
			var rfChoice = event.target.custom_default.checked; //choice if the user picked custom or default form, true: custom

			var title = event.target.title.value;
			var description = event.target.description.value;
			var location = event.target.location.value;
			var locationAddr = addr;
			var locationGeo = geo;
			var start = event.target.start.value;
			var end = event.target.end.value;
			var category = $("#event_cat").val();
			var type = $('#tokenfield').val().split(',');
			var channel = false;
			var contact = event.target.contact.value;
			var img = output.src;

			start = new Date(start);
			end = new Date(end);

			//if rfChoice == false it is default reg form
			if(!rfChoice) {
				var rf_name = event.target.rf_name.checked;
				var rf_contact_mobile = event.target.rf_contact_mobile.checked;
				var rf_contact_email = event.target.rf_contact_email.checked;
				var rf_address_full = event.target.rf_address_full.checked;
				var rf_address_region = event.target.rf_address_region.checked;
				var rf_shirtSize_sml = event.target.rf_shirtSize_sml.checked;
				var rf_shirtSize_123 = event.target.rf_shirtSize_123.checked;
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
			
				Meteor.call("addEvent", title, description, location, locationAddr, locationGeo, start, end, category, type, channel, contact, img, function(error, result) {
					if(error) {
						console.log(error.reason);
					} else {
						Meteor.call("addEventTag", type);
						Meteor.call("addRegistrationForm", result, title, rf_name, rf_contact_mobile, rf_contact_email, rf_address_full, rf_address_region, rf_shirtSize_sml, rf_shirtSize_123, rf_nationality, rf_gender, rf_dietaryPref, rf_allergies, rf_bloodType, rf_faculty, rf_major, rf_nokInfo, rf_additional, rf_matric, rf_nric);
						Meteor.call("addEvent_User", result, title, function(error2, result2) {
							if(error2) {
								console.log(error2.reason);
							}
						});
						Router.go('event_View', { _id: result});
					}
				});
			} else {
				var customQns = [];
				$('.qnswrapper').each(function() {
						var qnsObj = {name: "", type: "", options: []}; //create a new object that stores name, type and options(if required)
						qnsObj.type = $('.qnstype', this).val();
						qnsObj.name = $('.qnsname', this).val();
						// if the type is multiple choice, get all the options
						if(qnsObj.type == "mcq" || qnsObj.type == "checkbox") {
							$('.eachUF', this).each(function() {
								qnsObj.options.push($('.optname', this).val()); // insert each option into this.options array
							});
						}
						customQns.push(qnsObj);
					}
				);

				Meteor.call("addEvent", title, description, location, locationAddr, locationGeo, start, end, category, type, channel, contact, img, function(error, result) {
					if(error) {
						console.log(error.reason);
					} else {
						Meteor.call("addEvent_User", result, title, function(error3, result3) {
							if(error3) {
								console.log(error3.reason);
							}
						});
						Meteor.call("addCustomRF", result, title, customQns, function(error2, result2) {
							if(error2) {
								alert(error2.reason);
							} else {
								Router.go('event_View', { _id: result});
							}
						});	
					}
				});
			}
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
			previous_fs.show('slow');
			$("html, body").animate({ scrollTop: 0 }, "slow");
			//hide current fieldset
			current_fs.hide('slow');
			animating = false;
		},

		'click .next-s1': function(event){
			event.preventDefault();
			var current_fs, next_fs, previous_fs; //fieldsets
			var left, opacity, scale; //fieldset properties which we will animate
			var animating; //flag to prevent quick multi-click glitches

			if(!$("#new-event").valid()) {
				return false;
			} else {
				// for confirmation page
				var title = $('input[name="title"]').val();
				var description = $('textarea[name="description"]').val();
				var location = $('input[name="location"]').val();
				var start = $('input[name="start"]').val();
				var end = $('input[name="end"]').val();
				var type = $('#tokenfield').val().split(',');
				var privacy = $('input[name="privacy"]').is(':checked');
				var contact = $('input[name="contact"]').val();
				var img = $('input[name="img"]').val();

				$('input[name="c-title"]').val(title);
				$('textarea[name="c-description"]').val(description);
				$('input[name="c-location"]').val(location);
				$('input[name="c-start"]').val(start);
				$('input[name="c-end"]').val(end);
				$('input[name="c-contact"]').val(contact);

				if(privacy) {
					$('input[name="c-privacy"]').val("Private Event");
				} else {
					$('input[name="c-privacy"]').val("Public Event");
				}
			}

			if(animating) return false;
			animating = true;

			current_fs = $(event.target).parent();
			next_fs = $(event.target).parent().next();

			//activate next step on progressbar using the index of next_fs
			$("#progressbar li").eq($("fieldset").index(next_fs)).addClass('active');

			//show the next fieldset
			next_fs.show('slow');
			$("html, body").animate({ scrollTop: 0 }, "slow");
			//hide the current fieldset with style
			current_fs.hide('slow');
			animating = false;
		},

		'click .next-s2': function(event){
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
			next_fs.show('slow');
			$("html, body").animate({ scrollTop: 0 }, "slow");
			//hide the current fieldset with style
			current_fs.hide('slow');
			animating = false;
		},

		'click #add': function(event) {
			if(currFields >= maxFields) {
				alert("You have reached the maximum number of fields you can add. Please consider to revise your Registration Form. Thank you.");
				return false;
			}

			var intId = $("#buildyourform div").length + 1;
			var qnsWrapper = $("<div class=\"qnswrapper\" id=\"field" + intId + "\"/>");

			var qnsHeader = $("<div class=\"qnsheader row form-group\" id=\"qHeader" + intId + "\"/>");
			var qnsName = $("<div class=\"col-sm-8\"><label>Field Title</label><input type=\"text\" class=\"qnsname form-control\"></div>");
			var qnsType = $("<div class=\"col-sm-4\"><label>Field Type</label><select class=\"qnstype form-control\" onchange=\"fieldTypeChange(this);\"><option value=\"checkbox\">Check Boxes</option><option value=\"mcq\">Multiple Choices</option><option value=\"textbox\" selected=\"selected\">Text</option><option value=\"textarea\">Paragraph</option></select></div>");

			var qnsBody = $("<div class=\"qnsbody row form-group\" id=\"qBody" + intId + "\"/>");
			var qnsDisplay = $("<div class=\"col-sm-12\" id=\"fDisplay" + intId + "\"> </div>");

			var qnsFooter = $("<div class=\"qnsfooter row form-group\" id=\"qFooter" + intId + "\"/>");
			var qnsRemoveButton = $("<div class=\"col-sm-1 pull-right\"><span role=\"button\" class=\"remove glyphicon glyphicon-trash\"></span></div>");
			var qnsAddButton = $("<div class=\"col-sm-1\"><span role=\"button\" class=\"remove glyphicon glyphicon-plus\" id=\"add\"></span></div>");

			qnsRemoveButton.click(function() {
				if(currFields <= 1) {
					alert("You need to include at least 1 question in your Registration Form. Thank you.");
					return false;
				}

			    $(this).parent().parent().remove();
			    currFields--;
			});

			qnsHeader.append(qnsName);
			qnsHeader.append(qnsType);

			qnsBody.append(qnsDisplay);

			qnsFooter.append(qnsRemoveButton);
			qnsFooter.append(qnsAddButton);

			qnsWrapper.append(qnsHeader);
			qnsWrapper.append(qnsBody);
			qnsWrapper.append(qnsFooter);

			$("#buildyourform").append(qnsWrapper);
			currFields++;
		},

		'change #custom-default': function(event) {
			event.preventDefault();

			if(event.target.checked) {
				$('#defaultRF').hide('slow');
				$('#customRF').fadeIn('slow');
			} else {
				$('#customRF').hide('slow');
				$('#defaultRF').fadeIn('slow');
			}
		}
	});
}