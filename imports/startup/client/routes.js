import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/models/models.js';
import '../../ui/pages/3dview/3dview.js';
import '../../ui/pages/modelAdd/modelAdd.js';
import '../../ui/pages/not-found/not-found.js';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home' });
  },
});

FlowRouter.route('/add', {
  name: 'Models.add',
  action() {
    BlazeLayout.render('App_body', { main: 'App_model_add' });
  },
});

FlowRouter.route('/3dview/:_id', {
  name: 'Models.view',
  action(params, queryParams) {
    BlazeLayout.render('App_body', { main: 'App_3dview' });
  }
});

FlowRouter.route('/3dview/:_id/:_revisionId', {
  name: 'Models.view',
  action(params, queryParams) {
    BlazeLayout.render('App_body', { main: 'App_3dview' });
  }
});

FlowRouter.route('/models', {
  name: 'Models.mylist',
  action(params, queryParams) {
    BlazeLayout.render('App_body', { main: 'App_models' });
  }
});

FlowRouter.route('/collabs', {
  name: 'Models.collablist',
  action(params, queryParams) {
    BlazeLayout.render('App_body', { main: 'App_models' });
  }
});

FlowRouter.route('/models/:_id', {
  name: 'Models.show',
  action(params, queryParams) {
    BlazeLayout.render('App_body', { main: 'App_models' });
  }
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
