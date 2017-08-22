import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/event_Create.html';
import '../css/eventForm.css';
import '../lib/bootstrap-tokenfield.min.css';
import '../lib/bootstrap-datetimepicker.min.css';

Template.event_Create.onCreated(function() {
	let template = Template.instance();
  	template.disableBtn = new ReactiveVar(false);
  	template.uploadedFile = new ReactiveVar();

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
  				//console.log("No place input");
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
  					//console.log("Returned place contains no geometry");
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

Template.event_Create.onRendered(function() {
	//Datetimepicker verification
	var dateToday = new Date();
  	$('#datetimepicker_start').datetimepicker({
		minDate: dateToday,
		calendarWeeks: true
  	});

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
	Eventvalidator = $("#new-event").validate({
  		rules: {
	  		title: "required",
	  		description: "required",
	  		location: "required",
	  		start: "required",
	  		end: "required",
	  		contact: "required",
	  		type: "required",
	  		signUpDeadline: "required",
	  		img: "required"
  		},
  		groups: {
			duration: "start end"
		},
		errorPlacement: function(error, element) {
			if (element.attr("name") == "start" || element.attr("name") == "end") {
				error.insertAfter("#datetimepicker_start");
			} else if (element.attr("name") == "signUpDeadline") {
				error.insertAfter("#datetimepicker_signUpDeadline");
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
			type: "Please specify event type",
			signUpDeadline: "Please specify Signup Deadline",
			img: "Please specify Poster image for Event"
  		}
  	});
});

Template.event_Create.helpers({
	/*images: function() {
		return Images.find();
	},*/
	exampleMapOptions: function() {
		// Make sure the maps API has loaded
		if (GoogleMaps.loaded()) {
		   	// Map initialization options
		   	return {
		    	center: new google.maps.LatLng(1.3521, 103.8198),
		    	zoom: 10
			};
		}
	},
	disableBtn: function() {
	    if(Template.instance().disableBtn.get()) {
		    return "disabled";
		} else {
		    return "";
		}
	}
});

Template.event_Create.events({
	'submit .new-event': function(event, template) {
		event.preventDefault();
		var rfChoice = event.target.custom_default.checked; //choice if the user picked custom or default form, true: custom

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
		var type = $('#tokenfield').val().split(',');
		var channel = false;
		var contact = event.target.contact.value;
		var img = output.src;

		start = new Date(start);
		end = new Date(end);
		signUpDeadline = new Date(signUpDeadline);

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

			Meteor.call("addEvent", title, description, location, locationAddr, locationGeo, venue, start, end, signUpDeadline, category, type, channel, contact, img, function(error, result) {
				if(error) {
					//console.log(error.reason);
				} else {
					/*
					var xhr = new XMLHttpRequest();
					xhr.open('POST', '/.server_Upload', true);
					xhr.setRequestHeader("lneon", imgName);
					xhr.send(template.uploadedFile.get());*/

					template.disableBtn.set(true);
					Meteor.call("addEventTag", type);
					Meteor.call("addRegistrationForm", result, title, rf_name, rf_contact_mobile, rf_contact_email, rf_address_full, rf_address_region, rf_shirtSize_sml, rf_shirtSize_123, rf_nationality, rf_gender, rf_dietaryPref, rf_allergies, rf_bloodType, rf_faculty, rf_major, rf_nokInfo, rf_additional, rf_matric, rf_nric);
					Meteor.call("addEvent_User", result, title);
					Meteor.call("sendEventEmail", result);
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

			Meteor.call("addEvent", title, description, location, locationAddr, locationGeo, venue, start, end, signUpDeadline, category, type, channel, contact, img, function(error, result) {
				if(error) {
					//console.log(error.reason);
				} else {
					template.disableBtn.set(true);
					Meteor.call("addEventTag", type);
					Meteor.call("addEvent_User", result, title);
					Meteor.call("addCustomRF", result, title, customQns, function(error2, result2) {
						if(error2) {
							alert(error2.reason);
						} else {
							Meteor.call("sendEventEmail", result);
							Router.go('event_View', { _id: result});
						}
					});	
				}
			});
		}
		return false;
	},

	'change .img-input': function(event, template) {
		event.preventDefault();
		var uploadedFile = event.target.files[0];
		output = document.getElementById('output');
		var error = false;

		if(uploadedFile) {
			if(uploadedFile.size > 15000000) {
				Eventvalidator.showErrors({
	              img: "Please ensure your poster's size is less than 15MB."
	            });
	            error = true;
			} else {
				var fileName = uploadedFile.name;
				if(fileName.length > 4) {
					var mime = fileName.substring(fileName.length-4);
					if(mime === '.png' || mime === '.jpg' || mime === '.gif') {
						error = false;
					} else {
						Eventvalidator.showErrors({
			              img: "Please ensure your poster's file type is .png/.jpg/.gif."
			            });
						error = true;
					}
				}
			}
			
			if(!error) {
				var reader = new FileReader();
				reader.onload = function() {
					var dataURL = reader.result;
					//output = document.getElementById('output');
					output.src = dataURL;
				};
				reader.readAsDataURL(uploadedFile);
				template.uploadedFile.set(uploadedFile);
			} else {
				output.src = "";
				$("#img-input").val("");
				template.uploadedFile.set();
			}
		}
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
			var signUpDeadline = $('input[name="signUpDeadline"]').val();
			var type = $('#tokenfield').val().split(',');
			var privacy = $('input[name="privacy"]').is(':checked');
			var contact = $('input[name="contact"]').val();
			var img = $('input[name="img"]').val();

			start = new Date(start);
			end = new Date(end);
			signUpDeadline = new Date(signUpDeadline);

			if(start >= end) {
				Eventvalidator.showErrors({
		            start: "Start Date should not be after End Date",
		            end: "Start Date should not be after End Date"
		        });
				return false;
		    }

		    if(signUpDeadline > start) {
		    	Eventvalidator.showErrors({
		            signUpDeadline: "Sign Up Deadline should not be after Start Date"
		        });
				return false;
		    }

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