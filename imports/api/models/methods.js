// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Models } from './models.js';

Meteor.methods({
  'models.insert'(title, file) {
    check(file, String);
    check(title, String);

    return Models.insert({
      file,
      title,
      createdAt: new Date(),
    });
  },
});
