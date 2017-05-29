import { Models } from '/imports/api/models/models.js';
import { Meteor } from 'meteor/meteor';
import './modelList.html';

Template.modelList.onCreated(function () {
  this.subscribe('models.users');
  if (ActiveRoute.name('Models.mylist')) {
    this.subscribe('models.private');
  }
  else if (ActiveRoute.name('Models.collablist')) {
    this.subscribe('models.usercollabs');
  }
  else {
    this.subscribe('models.public');
  }
});

Template.modelList.helpers({
  models() {
    return Models.find({});
  },
  isMyModels() {
    return ActiveRoute.name('Models.mylist');
  },
  isMyCollabs() {
    return ActiveRoute.name('Models.collablist');
  },
  userName(userId) {
    return Meteor.users.findOne(userId).emails[0].address;
  }
});

Template.modelList.events({

});
