// Tests for the behavior of the links collection
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Revisions } from './revisions.js';

if (Meteor.isServer) {
  describe('revisions collection', function () {
    it('insert correctly', function () {
      const revisionId = Revisions.insert({
        modelId: 'testmodelid',
        file: 'testfile',
      });
      const added = Revisions.find({ _id: revisionId });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, 'revisions');
      assert.equal(count, 1);
    });
  });
}
