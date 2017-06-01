Template.dropzone.events({
	'dropped #dropzone': function(event) {
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
})