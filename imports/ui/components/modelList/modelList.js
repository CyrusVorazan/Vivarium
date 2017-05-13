import { Models } from '/imports/api/models/models.js';
import { Meteor } from 'meteor/meteor';
import './modelList.html';

Template.modelList.onCreated(function () {
  Meteor.subscribe('models.all');
});

Template.modelList.helpers({
  models() {
    return Models.find({});
  },
});

Template.modelList.events({
  
});
