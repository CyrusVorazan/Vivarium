import { Meteor } from 'meteor/meteor';
import { Models } from '../models.js';

Meteor.publish('models.all', function () {
  return Models.find();
});
