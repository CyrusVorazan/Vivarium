import { Models } from '/imports/api/models/models.js';
import { Meteor } from 'meteor/meteor';
import './modelList.html';

Template.modelList.onCreated(function () {
  Meteor.subscribe('models.all');
});

Template.modelList.helpers({
  models() {
    return Models.find({});
  },
});

Template.modelList.events({
  'submit .modelList-link-add'(event) {
    event.preventDefault();

    const target = event.target;
    const title = target.title;
    const file = target.file;

    Meteor.call('models.insert', title.value, btoa(file.files[0]), (error) => {
      if (error) {
        alert(error.error);
      } else {
        title.value = '';
        file.value = '';
      }
    });
  },
});
