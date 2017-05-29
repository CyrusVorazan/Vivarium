// Tests for the links publications
//
// https://guide.meteor.com/testing.html

import { assert } from 'meteor/practicalmeteor:chai';
import { Collaborators } from '../collaborators.js';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publications.js';

describe('collaborators publications', function () {
  beforeEach(function () {
    Collaborators.remove({});
    Collaborators.insert({
      userId: 'testuserid',
      modelId: 'testmodelid',
    });
  });

  describe('collaborators.all', function () {
    it('sends all collaborators', function (done) {
      const collector = new PublicationCollector();
      collector.collect('collaborators.all', (collections) => {
        assert.equal(collections.collaborators.length, 1);
        done();
      });
    });
  });
});
