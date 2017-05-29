import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Revisions } from './revisions.js';
import './methods.js';

if (Meteor.isServer) {
  describe('revisions methods', function () {
    beforeEach(function () {
      Revisions.remove({});
    });

    it('can add a new revision', function () {
      const addCollab = Meteor.server.method_handlers['revisions.insert'];

      addCollab.apply({}, ['testmodelid', 'testtitle', 'testdesc', 'testfile']);

      assert.equal(Revisions.find().count(), 1);
    });
  });
}
