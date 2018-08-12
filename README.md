# About GoPost!
GoPost! was developed with the intention to connect students in NUS through an interactive web application. GoPost! is an exciting platform that provide users a one-stop portal for all events needs. The web application is coded in meteor.js and offers a spectrum of features and utility. Users will be able to create events, create a registration forms, manage their events schedules, and many more. Visit [gopostnow](http://gopostnow.herokuapp.com) for more!

![home-page](documentation/image/home_page.png)

# Setting up GoPost!

GoPost is coded using meteor.js, bootstrap with additional dependencies on mailgun, jquery and heroku.

# GoPost! Features

Below are a list of features that have been developed in GoPost:

## 1. Login / Register Feature

In order to gain access to the information in GoPost, users have to register with an email account. The following information will be required to create an account:

	* username
	* password
	* email address

![register-page](documentation/image/register.png)

Upon logging in, first time users are required to key in a verification code which will be sent to their email account. If users are not verified, they will not be able to access the web application. For subsequent login, users will be logging in with their email address and password.

![login](documentation/image/login.png)


## 2. Web Application Walkthrough

A simple walkthrough that guides unfamiliar users through the various navigation options. It requires some user interaction which helps to engage the users in completing the walkthrough. However, users can opt to end the tour at any part of it. It can be accessed by users again, if they need guidance once more. This walkthrough is created using Bootstrap Tour.

![walkthrough](documentation/image/firstTour.png)


## 3. Search and Filter
A simple reactive search function and filter have been implemented using Meteor.js framework. Users are able to filter, search, and toggle views for event contents. 


### Events Board View

There are two main view for the users:

	**Grid View**

	![gridview](documentation/image/gridview.png)

	**list View**

	![listview](documentation/image/listview.png)


### Search Options

Users are able to search for events using filters or keywords.

	**Search by searchbar**

	![searchbar](documentation/image/searchBar.png)

	**Search by filter**

	![searchFilter](documentation/image/searchFilter.png)

	**Search by tags**

	![searchTag](documentation/image/searchTag.png)


## 4. Create Events
A straightforward 3 steps creation form that allow users to create their own event. The create event form is designed based on Meteor.js framework and jQuery library. In step 2, user is able to either create a custom sign-up form or use the available template for the creation of a sign-up form for their event.

![eventStep1](documentation/image/createEvent1.png)


## 5. Update Events

## 6. Simple Event Display
For normal users, they are able to like, subscribe, view organizer profile, sign up for events, view participants.

## 7. Event Summary Excel Download
For organizers, under my events management, users are able to download the list of  participants sign up information in Excel file format.

## 8. Dashboard
Minimal and sleek dashboard that allows the user to manage their personal profile and schedule. The dashboard allows the user to have access to various events items that they have liked, subscribed, going or hosted. The calendar was designed with FullCalendar, an open source JavaScript jQuery plugin for a full-sized, drag & drop event calendar.

![gridview](documentation/image/dashBoard.png)

Users are also able to update their profile 

	**Change Image**

	![changeImage](documentation/image/dashboard_image.png)

	**Edit Profile Details**

	![changeProfile](documentation/image/dashboard_edit.png)

	**Change Password**

	![changePass](documentation/image/dashboard_reset.png)


## 9. Messaging Feature
With Meteor.js as the base, a simple messaging feature was created to facilitate communication between organizers and participants of an event.

![chatbox](documentation/image/chatbox.png)


## 10. Users subscription

Users are able to subscribe to the content of other users to know what events they like, what events they are going. 

	**Discover Friends**
	
	![discover](documentation/image/discoverFriend.png)

	**People subscribing to you**

	![subscribers](documentation/image/subscribers.png)

	**People you are subscribing to**

	![subscribe](documentation/image/subscribe.png)


## 11. Event Email Notifications Settings
Users are able to customize notification options for events. Whenever a new event is created, an email will be sent to all users who have subscribed for email notification.

# Future Development Plan
- [ ] Creating a mobile application version of the project.
- [ ] Implementation of Calendar Synchronisation of project.
- [x] Sharing of Events to  Social Media.
- [ ] Better support across different browsers.
- [ ] Forum for Discussions.
- [ ] Notification Feed for User’s Activity
- [ ] Faster loading speed for web application
- [ ] More intuitive UI for like and subscribe.
- [x] Comment Section for Events
- [ ] Secure and Authentic Email Notification (Prevent Junk / Spam Mails)
- [ ] Secure and Authentic Downloads for Excel File.
- [ ] Security of Web Application.
- [ ] Image file upload size control and management.
