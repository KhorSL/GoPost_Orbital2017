import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/components/forgetPasswordPage.html';
import '../css/loginReg.css';

Template.forgetPasswordPage.onRendered(function() {

  var validator = $('.resetpassword-form').validate({
    submitHandler: function(event) {   //Activates when form is submitted

      var email = $.trim(event.emailAddr.value);

      Meteor.call("checkIfUserEmailExists", email, function(error, result) {
        if(result) {
          //email found.
          Session.set("sendToken", email);
          $('#forgetPasswordModal').modal('hide'); 
          Router.go('verify_AccPage');
        } else {
          //no email found.
          validator.showErrors({
            emailAddr: "That Email is not registered. Please enter a valid email."
          });
        }
      });
    } //end of submitHandler
  }); //end of validate
}); //end of onRendered

Template.forgetPasswordPage.events({
  'submit .resetpassword-form' :function(e) {
    e.preventDefault();
  }
});
