// Tests for the links publications
//
// https://guide.meteor.com/testing.html

import { assert } from 'meteor/practicalmeteor:chai';
import { Models } from '../models.js';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publications.js';

describe('models publications', function () {
  beforeEach(function () {
    Models.remove({});
    Models.insert({
      title: 'testtitle',
      description: 'testdescription',
    });
  });

  describe('models.all', function () {
    it('sends all models', function (done) {
      const collector = new PublicationCollector();
      collector.collect('models.all', (collections) => {
        assert.equal(collections.models.length, 1);
        done();
      });
    });
  });
});
