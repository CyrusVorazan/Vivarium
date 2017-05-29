/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/dburles:factory';
import { chai } from 'meteor/practicalmeteor:chai';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';

import { withRenderedTemplate } from '../../test-helpers.js';

import { Models } from '../../../api/models/models.js';


describe('modelList', function () {
  beforeEach(function () {
    Template.registerHelper('_', key => key);
  });

  afterEach(function () {
    Template.deregisterHelper('_');
  });

  it('renders correctly with simple data', function () {
    const timestamp = new Date();

    const modelsCollection = new Mongo.Collection(null, { transform: Models._transform });
    _.times(3, (i) => {
      const todo = Factory.build('model', {
        userId: 'testuserid',
        createdAt: new Date(timestamp - (3 - i)),
      });
      modelsCollection.insert(todo);
    });
    const modelsCursor = modelsCollection.find({}, { sort: { createdAt: -1 } });

    const data = {
      models: todosCursor,
    };

    withRenderedTemplate('modelList', data, (el) => {
      const modelText = modelsCursor.map(t => t.title);
      const renderedText = $(el).find('.header')
        .map((i, e) => $(e).val())
        .toArray();
      chai.assert.deepEqual(renderedText, todosText);
    });
  });
});
