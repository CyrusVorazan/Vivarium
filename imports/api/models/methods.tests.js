// Tests for links methods
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Models } from './models.js';
import './methods.js';

if (Meteor.isServer) {
  describe('models methods', function () {
    beforeEach(function () {
      Models.remove({});
    });

    it('can add a new model', function () {
      const addCollab = Meteor.server.method_handlers['models.insert'];

      addCollab.apply({}, ['testuserid','testtitle','testdescription',false]);

      assert.equal(Models.find().count(), 1);
    });
  });
}
