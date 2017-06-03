import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/demo/demo.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/admin/admin.js';
import '../../ui/pages/insight/insight.js';
import '../../ui/pages/not-found/not-found.js';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'Home' });
  },
});

FlowRouter.route('/insight', {
  name: 'App.insight',
  action() {
    BlazeLayout.render('App_body', { main: 'Insight' });
  },
});

FlowRouter.route('/demo', {
  name: 'App.demo',
  action() {
    BlazeLayout.render('App_body', { main: 'Demo' });
  },
});

FlowRouter.route('/admin', {
  name: 'App.demo',
  action() {
    BlazeLayout.render('App_body', { main: 'Admin' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
