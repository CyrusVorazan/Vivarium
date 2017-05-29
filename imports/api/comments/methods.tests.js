// Tests for links methods
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Comments } from './comments.js';
import './methods.js';

if (Meteor.isServer) {
  describe('comments methods', function () {
    beforeEach(function () {
      Comments.remove({});
    });

    it('can add a new comment', function () {
      const addCollab = Meteor.server.method_handlers['comments.insert'];

      addCollab.apply({}, ['testuserid', 'testrevisionid', 'text']);

      assert.equal(Comments.find().count(), 1);
    });
  });
}
