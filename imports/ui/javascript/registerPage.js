import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/registerPage.html';
import '../css/loginReg.css';

$.validator.setDefaults({
  rules: {
      userName: {
        required: true,
      },
      emailAddr: {
        required: true,
        email: true
      },
      password1: {
        required: true,
        minlength: 3
      },
      password2: {
        required: true,
        minlength: 3,
        equalTo: "#password1"
      }
    },
    messages: {
      userName: {
        required: "Please enter an username."
      },
      emailAddr: {
        required: "Please enter an email address.",
        email: "You've entered an invalid email address."
      },
      password1: {
        required: "Please enter a password.",
        minlength: "Your password must be at least {0} characters."
      },
      password2: {
        required: "Please enter a password.",
        minlength: "Your password must be at least {0} characters.",
        equalTo: "Password do not matched! Please enter again."
      }
    } 
});

Template.registerPage.onRendered(function() {
  var validator = $('.register-form').validate({
    submitHandler: function(event) {   //Activates when form is submitted

      var un = $('[name=userName]').val();
      var em = $('[name=emailAddr]').val();
      var pw1 = $('[name=password1]').val();
      var pw2 = $('[name=password2]').val();

      var newUserData = {
        username: un,
        email: em,
        password: pw1
      };

      Meteor.call('insertUser', newUserData, function(error, result) {
        if(error) {
          //Three possible Error (Email already exists) (Need to set a username or email) (password may not be empty)
          if(error.reason == "Username already exists."){
            validator.showErrors({
              userName: "That Username have already been taken."      
            });
          }
          if(error.reason == "Email already exists."){
            validator.showErrors({
              emailAddr: "That email already belongs to a registered user."  
            });
          }
        } else {
          Meteor.loginWithPassword(newUserData.email, newUserData.password);
          $('#registerModal').modal('hide');
          Router.go('/home');
        } 
      }); //end of Method.call(insertUser)
    } //end of submitHandler
  }); //end of validate
}); //end of onRendered

Template.registerPage.events({
  'submit .register-form' :function(e) {
    e.preventDefault();
    /*
    var email = $('[name=emailAdd]').val();
    var un = $('[name=userName]').val();
    var pw1 = $('[name=password1]').val();
    var pw2 = $('[name=password2]').val();

    if(pw1 == pw2) {
      var newUserData = {
        username: un,
        email: email,
        password: pw1
      };

      Meteor.call('checkUser', newUserData, function(error,result) {
          if(result <= 0) {
            Meteor.call('insertUser', newUserData);
            Meteor.loginWithPassword(newUserData.email, newUserData.password);
             $('#registerModal').modal('hide');
             Router.go('/home');

          } else if (result == 1) {
            alert("Username have been taken, please enter another Username.");
          } else if (result == 2) {
            alert("There is already a user registered with this email.");
          }
      });

    } else {
      alert("Password do not match!");
    }
    */
  }
});