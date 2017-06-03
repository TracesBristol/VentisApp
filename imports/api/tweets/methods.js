// Methods related to tweets

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Tweets } from './tweets.js';
import { Keywords } from './tweets.js';

import { Tag_Map } from './tweets.js';
import { TagSentiment_Map } from './tweets.js';
import { Location_Map } from './tweets.js';
import { Token_Map } from './tweets.js';
import { Language_Map } from './tweets.js';
import { Date_Map } from './tweets.js';

Meteor.methods({
    // Keyword methods

    addKeyword: function(newKeyword) {
        check(newKeyword, String);
        return Keywords.insert({word: newKeyword, addedAt: new Date()});
    },

    removeKeyword: function(newKeyword) {
        check(newKeyword, String);
        return Keywords.remove({word: newKeyword});
    },

    // MapReduce methods

    tagCount: function() {
        var tagMap = function() {
            var tag = this.tag;
            if (tag) {
                tag = tag.toLowerCase();
                emit(tag, 1);
            } else {
                return;
            }
        }

        var tagReduce = function(key, values) {
            var count = 0;
            values.forEach(function(v) {
                count += v;
            });
            return count;
        }

        var result = Tweets.mapReduce(tagMap, tagReduce, { query: {}, out: "tag_map" });

    },
    
    tagSentiment: function() {
        var tsMap = function() {
            var tag = this.tag;
            var polarity = this.polarity;
            if (tag && polarity) {
                tag = tag.toLowerCase();
                emit(tag, parseFloat(polarity));
            } else {
                return;
            }
        }

        var tsReduce = function(key, values) {
            var count = 0;
            var sum = 0;
            var mean = 0;
            values.forEach(function(v) {
                count += 1;
                sum += v;
            });
            mean = sum / count;
            return mean;
        }

        var result = Tweets.mapReduce(tsMap, tsReduce, { query: {}, out: "tagSentiment_map" });

    },
    
    locationCount: function(tag) {
        var locationMap = function() {
            var location = this.location;
            var tag = this.tag;
            if (location && tag) {
                location = location.toLowerCase();
                emit(location, 1);
            } else {
                return;
            }
        }

        var locationReduce = function(key, values) {
            var count = 0;
            values.forEach(function(v) {
                count += v;
            });
            return count;
        }

        if (tag != "") {
            var result = Tweets.mapReduce(locationMap, locationReduce, { query: {"tag": tag}, out: "location_map" });
        } else {
            var result = Tweets.mapReduce(locationMap, locationReduce, { query: {}, out: "location_map" });
        }

    },
    
    tokenCount: function(tag) {
        var tokenMap = function() {
            var tokens = this.tokens;
            var tag = this.tag;
            if (tokens && tag) {
                for (var i = tokens.length - 1; i >= 0; i--) {
                    if (tokens[i]) { // make sure there's something
                        emit(tokens[i], 1); // store a 1 for each word
                    }
                }
            } else {
                return;
            }
        }

        var tokenReduce = function(key, values) {
            var count = 0;
            values.forEach(function(v) {
                count += v;
            });
            return count;
        }

        if (tag != "") {
            var result = Tweets.mapReduce(tokenMap, tokenReduce, { query: {"tag": tag}, out: "token_map" });
        } else {
            var result = Tweets.mapReduce(tokenMap, tokenReduce, { query: {}, out: "token_map" });
        }

    },
    
    languageCount: function(tag) {
        var languageMap = function() {
            var language = this.lang;
            var tag = this.tag;
            if (language && tag) {
                language = language.toLowerCase();
                emit(language, 1);
            } else {
                return;
            }
        }

        var languageReduce = function(key, values) {
            var count = 0;
            values.forEach(function(v) {
                count += v;
            });
            return count;
        }

        if (tag != "") {
            var result = Tweets.mapReduce(languageMap, languageReduce, { query: {"tag": tag}, out: "language_map" });
        } else {
            var result = Tweets.mapReduce(languageMap, languageReduce, { query: {}, out: "language_map" });
        }
    },
    
    dateCount: function(tag) {
        var dateMap = function() {
            var dateParsed = new Date(this.created_at);
            var dateParsed2 = new Date(dateParsed.setHours(0,0,0,0));
            var date = dateParsed2.toISOString();
            var tag = this.tag;
            if (date && tag) {
                emit(date, 1);
            } else {
                return;
            }
        }

        var dateReduce = function(key, values) {
            var count = 0;
            values.forEach(function(v) {
                count += v;
            });
            return count;
        }
        if (tag != "") {
            var result = Tweets.mapReduce(dateMap, dateReduce, { query: {"tag": tag}, out: "date_map" });
        } else {
            var result = Tweets.mapReduce(dateMap, dateReduce, { query: {}, out: "date_map" });
        }
    },
});
