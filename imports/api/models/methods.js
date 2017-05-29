import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Models } from './models.js';
import { Revisions } from '/imports/api/revisions/revisions.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Meteor.methods({
  'models.insert'(userId, title, description, isPublic) {
    check(title, String);
    check(description, String);

    return Models.insert({
      title,
      description,
      createdAt: new Date(),
      userId,
      isPublic
    });
  },
});
