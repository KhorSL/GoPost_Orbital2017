UserEvents = new Mongo.Collection('userEvents');

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

if(Meteor.isClient) {
	Meteor.subscribe("userEvents");

	Template.eventform.helpers({
		userEvents: function() {
			if (Session.get('done')) {
				return UserEvents.find({checked: {$ne: true}});
			} else {
				return UserEvents.find();
			}
		},

		images: function() {
			return Images.find();
		},

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

	Template.eventform.onCreated(function() {
	  // We can use the `ready` callback to interact with the map API once the map is ready.
	  GoogleMaps.ready('exampleMap', function(map) {
	    // Add a marker to the map once it's ready
	    var marker = new google.maps.Marker({
	      position: map.options.center,
	      map: map.instance
	    });
	  });
	});

	Template.eventform.onRendered(function() {
	  GoogleMaps.load();
	});

	Template.eventform.events({
		'submit .new-event': function(event) {
			var title = event.target.title.value;
			var description = event.target.description.value;
			var location = event.target.location.value;
			var dateTime = event.target.dateTime.value;
			var type = event.target.type.value;
			var privacy = event.target.privacy.value;

			Meteor.call("addEvent", title, description, location, dateTime, type, privacy);

			return false;
		},

		'change .hide-finished': function(event) {
			Session.set('done', event.target.checked);
		},

		'change .img-input': function(event) {
			console.log(event);
			FS.Utility.eachFile(event, function(file){
				var newFile = new FS.File(file);
				Images.insert(newFile, function(error, result){
					if(error) {
						console.log('There is an issue with the upload');
					} else {
						console.log('Image Uploaded');
					}
				});
			});
		}
	});

	Template.userevents.events({
		'click .toggle-checked': function() {
			UserEvents.update(this._id, {$set: {
				checked: !this.checked
				}
			});
		},

		'click .delete': function() {
			Meteor.call("removeEvent", this._id);
		}
	});
}
