// All tweets-related publications

import { Meteor } from 'meteor/meteor';

import { Tweets } from '../tweets.js';
import { Keywords } from '../tweets.js';

import { Tag_Map } from '../tweets.js';
import { TagSentiment_Map } from '../tweets.js';
import { Location_Map } from '../tweets.js';
import { Token_Map } from '../tweets.js';
import { Language_Map } from '../tweets.js';
import { Date_Map } from '../tweets.js';

Meteor.publish('tweets.all', function () {
    return Tweets.find();
});

Meteor.publish('tweets.some', function(limit, tag) {
  //default limit if none set
    var temp = limit || 10;
    if (tag != "") {
        return Tweets.find({"tag": tag}, {limit: temp});
    } else {
        return Tweets.find({}, {limit: temp});
    }
});

Meteor.publish('tweets.show', function(tag) {
  //default limit if none set
    if (tag != "") {
        return Tweets.find({"tag": tag}, {sort: {'created_at': 1},limit: 3});
    } else {
        return Tweets.find({}, {sort: {'created_at': 1},limit: 3});
    }
});

Meteor.publish('keywords', function () {
    return Keywords.find();
});

Meteor.publish('tagMap', function () {
    return Tag_Map.find({}, { sort: {'value': -1}});
});

Meteor.publish('tagSentMap', function() {
  //default limit if none set
    return TagSentiment_Map.find({}, { sort: {'value': -1}});
});

Meteor.publish('locationMap', function (limit) {
    var temp = limit || 10;
    return Location_Map.find({}, {sort: {'value': -1}, limit: temp});
});

Meteor.publish('tokenMap', function (limit) {
    var temp = limit || 10;
    return Token_Map.find({}, {sort: {'value': -1}, limit: temp});
});

Meteor.publish('languageMap', function (limit) {
    var temp = limit || 10;
    return Language_Map.find({}, {sort: {'value': -1}, limit: temp});
});

Meteor.publish('dateMap', function () {
    return Date_Map.find({}, { sort: {'_id': -1}});
});
