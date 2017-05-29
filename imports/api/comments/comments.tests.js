// Tests for the behavior of the links collection
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Comments } from './comments.js';

if (Meteor.isServer) {
  describe('comments collection', function () {
    it('insert correctly', function () {
      const commentId = Comments.insert({
        userId: 'testuserid',
        text: 'text',
      });
      const added = Comments.find({ _id: commentId });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, 'comments');
      assert.equal(count, 1);
    });
  });
}
