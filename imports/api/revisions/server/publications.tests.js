// Tests for the links publications
//
// https://guide.meteor.com/testing.html

import { assert } from 'meteor/practicalmeteor:chai';
import { Revisions } from '../revisions.js';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publications.js';

describe('revisions publications', function () {
  beforeEach(function () {
    Revisions.remove({});
    Revisions.insert({
      modelId: 'testmodelid',
      file: 'testfile',
    });
  });

  describe('revisions.all', function () {
    it('sends all revisions', function (done) {
      const collector = new PublicationCollector();
      collector.collect('revisions.all', (collections) => {
        assert.equal(collections.revisions.length, 1);
        done();
      });
    });
  });
});
