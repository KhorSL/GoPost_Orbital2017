import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/loginPage.html';
import '../css/loginReg.css';

Template.loginPage.onRendered(function() {

  var validator = $('.login-form').validate({
    submitHandler: function(event) {   //Activates when form is submitted
      // store username and password in variables
      var email = $('[name=emailAdd]').val();
      var pw = $('[name=password]').val();
      
      Meteor.loginWithPassword(email,pw, function(error) {
        if(error) {
          //Three possible Error (Match failed) (User not found) (Incorrect password)
          if(error.reason == "User not found") {
            validator.showErrors({
              emailAdd: "That email doesn't belong to a registered user."   
            });
          }
          if(error.reason == "Incorrect password") {
            validator.showErrors({
              password: "You have entered an incorrect password."    
            });
          }
        } else {
          //Log in Successfully
          $('#loginModal').modal('hide');
          Session.set("viewToggle", false);
          Router.go('home');
        }
      });
    } //end of submitHandler
  }); //end of validate
}); //end of onRendered

Template.loginPage.events ({
	'submit .login-form': function(e) {
    e.preventDefault();

    /*
    // store username and password in variables
    var email = $('[name=emailAdd]').val();
    var pw = $('[name=password]').val();
    
    // define a function that tells us whether there's input
    var fieldsPopulated = function() {
      return email !== '' && pw !== '';
    };

    //if not populated, prompt error
    if(!fieldsPopulated()) {
      alert("Please fill in your userName and password");
    } else {
      Meteor.loginWithPassword(email,pw);
      $('#loginModal').modal('hide');
      Router.go('/home');
    }
    */
  }
});