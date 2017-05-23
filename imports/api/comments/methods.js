import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Comments } from './comments.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Meteor.methods({
  'comments.insert'(userId, revisionId, text) {
    check(text, String);

    return Comments.insert({
      text,
      userId,
      revisionId,
      createdAt: new Date()
    });
  },
});
