import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/verify_AccPage.html';

Template.verify_AccPage.onCreated(function() {
	let template = Template.instance();
	template.password_token = new ReactiveVar(); //variable for storing password token (forget password)
	template.errorMessage = new ReactiveVar(""); 
	template.email = new ReactiveVar("");
	template.currentDate = new ReactiveVar(new Date());
	template.disableBtn = new ReactiveVar(false);
	template.resetPassword = new ReactiveVar(false); //display resetPassword field.
	template.verifyCode = new ReactiveVar(true); //display verifyCode field

	var resend = false;

	if(Meteor.user()) {
		var user = Users.find({"User": Meteor.userId()}).fetch();
		var now = new Date();
		if (now.getTime() - user[0].TokenExpired.getTime() >= 15*60*1000) {
			/*https://stackoverflow.com/questions/7080051/checking-if-difference-between-2-date-is-more-than-20-minutes*/
			//token is created for longer than 10 minutes
			resend = true;
		} else {
			//console.log(user[0].Token);
			template.password_token.set(user[0].Token);
		}
		template.email.set(Meteor.user().emails[0].address);
	} else {
		//forget password. 
		template.email.set(Session.get("sendToken")); //retrieve email from landing page.
		resend = true;
	}

	var email = template.email.get();
	if(resend && email) {
		Meteor.call("sendVerificationToken", email, function(error, result) {
			if(error) {
				//console.log(error.reason);
			} else {
				//console.log(result);
				template.password_token.set(result);
				template.currentDate.set(new Date());
				resend = false;
			}
		});
	}
});

Template.verify_AccPage.onDestroyed(function() {
	delete Session.keys['sendToken'];
});

Template.verify_AccPage.helpers({
	resetPassword: function() {
		return Template.instance().resetPassword.get();
	},
	verifyCode: function() {
		return Template.instance().verifyCode.get();
	},
	errorMessage: function() {
		return Template.instance().errorMessage.get();
	},
	disableBtn: function() {
		if(Template.instance().disableBtn.get()) {
			return "disabled";
		} else {
			return "";
		}

	}
});

Template.verify_AccPage.events({
	'click #cancel_btn': function(e) {
		e.preventDefault();
		if(Meteor.user()) {
			Meteor.logout();
		} 
		Session.clear();
		Router.go('/');
	},
	'click #continue_btn': function(e, tmp) {
		e.preventDefault();
		tmp.errorMessage.set("");
		var code = $('[name=verification_Code]').val();
		if(code === tmp.password_token.get()) {
			//Right token was entered.
			var now = new Date();
			var timeSent = tmp.currentDate.get();
			if (now.getTime() - timeSent.getTime() >= 15*60*1000) {
				//Token Expired
				alert("Token have expired! Please click on the resend button to receive a new Verification Token");
			} else {
				//Token Usable
				if(Meteor.user()) {
					//forget password
					Meteor.call("verifyUserAccount", function(error, result) {
						if(error) {
							//console.log(error.reason);
						} else {
							//successfully registered
							Router.go('bulletinBoard');
						}
					});
				} else {
					//forget password
					tmp.verifyCode.set(false);
					tmp.resetPassword.set(true);

					var email = tmp.email.get();
					Meteor.call("sendResetPasswordEmail", email, function(error, result) {
						if(error) {
							//console.log(error.reason);
						} else {
							//console.log(result);
							tmp.password_token.set(result);
						}
					});
				}
			}
		} else {
			tmp.errorMessage.set("Invalid Token. Please enter the 10 character verification code sent to your email.");
		}
		tmp.disableBtn.set(false);
	},
	'click #resend_btn': function(e, tmp) {
		e.preventDefault();
		tmp.disableBtn.set(true);
		var email = tmp.email.get();
		Meteor.call("sendVerificationToken", email, function(error, result) {
			if(error) {
				//console.log(error.reason);
			} else {
				//console.log(result);
				tmp.password_token.set(result);
				tmp.currentDate.set(new Date());
			}
		});
	},
	'click #resend_pass_btn': function(e, tmp) {
		e.preventDefault();
		tmp.disableBtn.set(true);
		var email = tmp.email.get();
		Meteor.call("sendResetPasswordEmail", email, function(error, result) {
			if(error) {
				//console.log(error.reason);
			} else {
				//console.log(result);
				tmp.password_token.set(result);
			}
		});
	},
	'click #continue_pass_btn': function(e,tmp) {
		e.preventDefault();
		tmp.errorMessage.set("");
		var email = tmp.email.get();
		var old = $('[name=verify_password]').val();
		var new1 = $('[name=new_password]').val();
		var new2 = $('[name=new_password2]').val();

		if(old === tmp.password_token.get()) {
			//old password matched!
			if(new1 === "" || new2 === "") {
				tmp.errorMessage.set("Please enter your password.");
			} else {
				if(new1 === new2) {
					Meteor.call("resetPasswordForUser", email, new1, function(error) {
						if(error) {
							//console.log(error.reason);
						} else {
							alert("Password Reset successfully. Please log in again.");
							$("#cancel_btn").click();
						}
					});
				} else {
					tmp.errorMessage.set("Password do not match!");
				}
			}
		} else {
			tmp.errorMessage.set("Invalid password. Please enter the new password sent to your email.");
		}
		tmp.disableBtn.set(false);
	}
});