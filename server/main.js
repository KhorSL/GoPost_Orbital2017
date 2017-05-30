import { Meteor } from 'meteor/meteor';

UserEvents = new Mongo.Collection('userEvents');

Meteor.startup(() => {
  // code to run on server at startup
});
