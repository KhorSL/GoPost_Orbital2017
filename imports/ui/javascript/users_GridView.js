import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/users_GridView.html';
import '../css/myFriends.css';

Template.users_GridView.helpers({
  	isUser: function(){
    	if (this.User === Meteor.userId()){ //User visiting his own profile
      		return true;
    	} else {
     	 	return false;
    	}
  	},
  	hasSubscribed: function() {
  		var currFollowers = Users.find({"User":Meteor.userId()}).fetch().map(function (obj) {return obj.FollowingList;});
  		if(currFollowers.length > 0) {
      		currFollowers = _.flatten(currFollowers);
      		var q = _.find(currFollowers, function(id){return id===this.User});
      		if(q === this.User) {
       			 return true;
      		}
      		console.log(q + " == " + this.User);
    	} 

  		return false;
  	},
});

Template.users_GridView.events({

});