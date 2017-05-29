// Tests for the links publications
//
// https://guide.meteor.com/testing.html

import { assert } from 'meteor/practicalmeteor:chai';
import { Comments } from '../comments.js';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publications.js';

describe('comments publications', function () {
  beforeEach(function () {
    Comments.remove({});
    Comments.insert({
      userId: 'testuserid',
      text: 'text',
    });
  });

  describe('comments.all', function () {
    it('sends all comments', function (done) {
      const collector = new PublicationCollector();
      collector.collect('comments.all', (collections) => {
        assert.equal(collections.comments.length, 1);
        done();
      });
    });
  });
});
