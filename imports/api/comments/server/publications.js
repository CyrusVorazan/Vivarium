import { Meteor } from 'meteor/meteor';
import { Comments } from '../comments.js';

Meteor.publish('comments.all', function () {
  return Comments.find();
});

Meteor.publish('comments.inRevision', function (revisionId) {
  return Comments.find({ revisionId: revisionId });
});
