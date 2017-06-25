import { Tweets } from '../../../api/tweets/tweets.js';
import { Tag_Map } from '../../../api/tweets/tweets.js';
import { TagSentiment_Map } from '../../../api/tweets/tweets.js';
import { Location_Map } from '../../../api/tweets/tweets.js';
import { Token_Map } from '../../../api/tweets/tweets.js';
import { Language_Map } from '../../../api/tweets/tweets.js';
import { Date_Map } from '../../../api/tweets/tweets.js';


import './info.html';

Template.info.onCreated(function() {
    Meteor.call('tagCount');
    Meteor.call('tagSentiment');
    Meteor.call('locationCount',"");
    Meteor.call('tokenCount',"");
    Meteor.call('languageCount',"");
    Meteor.call('dateCount',"");
    Meteor.subscribe('tweets.some');
    Meteor.subscribe('tagMap');
    Meteor.subscribe('tagSentMap');
    Meteor.subscribe('locationMap', 10);
    Meteor.subscribe('tokenMap', 10);
    Meteor.subscribe('languageMap', 10);
    Meteor.subscribe('dateMap', 10);
});

Template.info.helpers({
    tweets() {
        return Tweets.find();
    },
    tagMap() {
        return Tag_Map.find();
    },
    tagSentMap() {
        return TagSentiment_Map.find();
    },
    locationMap() {
        return Location_Map.find();
    },
    tokenMap() {
        return Token_Map.find();
    },
    languageMap() {
        return Language_Map.find();
    },
    dateMap() {
        return Date_Map.find();
    },
});

Template.info.events({
    // 'submit .info-tweet-add'(event) {
    //   event.preventDefault();
    //
    //   const target = event.target;
    //   const title = target.title;
    //   const url = target.url;
    //
    //   Meteor.call('tweets.insert', title.value, url.value, (error) => {
    //     if (error) {
    //       alert(error.error);
    //     } else {
    //       title.value = '';
    //       url.value = '';
    //     }
    //   });
    // },

    // 'loadMR' (event) {
    //     event.preventDefault();
    //     const target = event.target;
    //     const title = target.title;
    //     const url = target.url;
    //
    //     Meteor.call('tagCount');
    //     Meteor.call('tagSentiment');
    //     Meteor.call('locationCount');
    //     Meteor.call('tokenCount');
    //     Meteor.call('languageCount');
    // },

});
