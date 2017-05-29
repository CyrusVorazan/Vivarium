import { Meteor } from 'meteor/meteor';
import { Collaborators } from '../collaborators.js';

Meteor.publish('collaborators.all', function () {
  return Collaborators.find();
});

Meteor.publish('collaborators.inModel', function (modelId) {
  return Collaborators.find({ modelId: modelId });
});
