// Tests for links methods
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Collaborators } from './collaborators.js';
import './methods.js';

if (Meteor.isServer) {
  describe('collaborators methods', function () {
    beforeEach(function () {
      Collaborators.remove({});
    });

    it('can add a new collaborator', function () {
      const addCollab = Meteor.server.method_handlers['collaborators.insert'];

      addCollab.apply({}, ['testuserid', 'testmodelid']);

      assert.equal(Collaborators.find().count(), 1);
    });
  });
}
