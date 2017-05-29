import { Meteor } from 'meteor/meteor';
import { Models } from '../models.js';
import { Collaborators } from '../../collaborators/collaborators.js';

Meteor.publish('models.all', function () {
  return Models.find();
});

Meteor.publish('models.current', function oneModel(modelId) {
  return Models.find(modelId);
});

Meteor.publish('models.public', function listsPublic() {
  return Models.find({isPublic: true});
});

Meteor.publish('models.private', function listsPrivate() {
  if (!this.userId) {
    return this.ready();
  }

  return Models.find({
    userId: this.userId,
  });
});

Meteor.publish('models.usercollabs', function() {
  var collabs = Collaborators.find({ userId: this.userId });
  var ids = [];
  collabs.forEach(function(item) {
    ids.push(item.modelId);
  });
  return Models.find({_id: {$in: ids}});
});

Meteor.publish("models.users", function () {
  return Meteor.users.find({});
});
