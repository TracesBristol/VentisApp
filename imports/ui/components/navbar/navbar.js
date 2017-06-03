import './navbar.html';

Template.navbar.events({
    'click #logout' (event) {
        event.preventDefault();
        Meteor.logout();
    },
});
