import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Collaborators } from './collaborators.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Email } from 'meteor/email';

Meteor.methods({
  'collaborators.insert'(modelId, userId) {

    const user = Meteor.users.findOne(userId);

/*
    Email.send({
    	to: user.emails[0].address,
    	from: "cyrusvorazan@gmail.com",
    	subject: "You were invited to collaborate on Vivarium",
    	text: "Good day! You were invited as a collaborator on Vivarium! Check the model out at localhost:3000/3dview/" + modelId,
    });
*/

    return Collaborators.insert({
      modelId,
      userId
    });
  },
  'collaborators.remove'(modelId, userId) {

    return Collaborators.remove({
      modelId: modelId,
      userId: userId
    });
  },
});
