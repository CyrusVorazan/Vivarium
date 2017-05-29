import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Revisions } from './revisions.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Meteor.methods({
  'revisions.insert'(modelId, title, description, file) {
    check(file, String);
    check(title, String);
    check(description, String);

    return Revisions.insert({
      file,
      title,
      description,
      createdAt: new Date(),
      modelId
    });
  },
  'revisions.remove'(revisionId) {
    return Revisions.remove(revisionId);
  },
});
