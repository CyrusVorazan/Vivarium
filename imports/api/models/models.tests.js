// Tests for the behavior of the links collection
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Models } from './models.js';

if (Meteor.isServer) {
  describe('models collection', function () {
    it('insert correctly', function () {
      const modelId = Models.insert({
        title: 'testtitle',
        description: 'testdescription',
      });
      const added = Models.find({ _id: modelId });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, 'models');
      assert.equal(count, 1);
    });
  });
}
