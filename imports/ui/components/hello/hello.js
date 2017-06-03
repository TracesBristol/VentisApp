import { Keywords } from '../../../api/tweets/tweets.js';

import { Meteor } from 'meteor/meteor';
import './hello.html';

Template.hello.onCreated(function helloOnCreated() {
    Meteor.subscribe('keywords');
});

Template.hello.helpers({
    keywords() {
        return Keywords.find();
    },
});

Template.hello.events({
    'submit .keyword-add' (event) {
        event.preventDefault();

        const target = event.target;
        const keyword = target.keyword;

        Meteor.call('addKeyword', keyword.value, (error) => {
            if (error) {
                alert(error.error);
            } else {
                keyword.value = '';
            }
        });
    },
    'submit .keyword-remove' (event) {
        event.preventDefault();

        const target = event.target;
        const keyword = target.keyword;

        Meteor.call('removeKeyword', keyword.value, (error) => {
            if (error) {
                alert(error.error);
            } else {
                keyword.value = '';
            }
        });
    },
});
