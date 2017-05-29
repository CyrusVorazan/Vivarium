import { Meteor } from 'meteor/meteor';
import { Revisions } from '../revisions.js';

Meteor.publish('revisions.all', function () {
  return Revisions.find();
});

Meteor.publish('revisions.inModel', function (modelId) {
  return Revisions.find({ modelId: modelId });
});
