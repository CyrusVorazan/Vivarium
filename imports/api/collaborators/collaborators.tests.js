// Tests for the behavior of the links collection
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Collaborators } from './collaborators.js';

if (Meteor.isServer) {
  describe('collaborators collection', function () {
    it('insert correctly', function () {
      const collaboratorId = Collaborators.insert({
        userId: 'testuserid',
        modelId: 'testmodelid',
      });
      const added = Collaborators.find({ _id: collaboratorId });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, 'collaborators');
      assert.equal(count, 1);
    });
  });
}
