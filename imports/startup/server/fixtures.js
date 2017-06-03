// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Tweets } from '../../api/tweets/tweets.js';

Meteor.startup(() => {
  // if the Tweets collection is empty, tell me
  if (Tweets.find().count() == 0) {
      console.log("Empty DB");
  }
});
