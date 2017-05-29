import './modelAdd.html';

import { Models } from '/imports/api/models/models.js';
import { Revisions } from '/imports/api/revisions/revisions.js';
import { Meteor } from 'meteor/meteor';
import { insert } from '/imports/api/models/methods.js';

Template.App_model_add.onCreated(function () {
  Meteor.subscribe('models.all', {
    onReady: function () {
      Meteor.subscribe('revisions.all', {
        onReady: function () {

        },
        onError: function () { console.log("onError", arguments); }
      });
    },
    onError: function () { console.log("onError", arguments); }
  });
});

Template.App_model_add.helpers({
  models() {
    return Models.find({});
  },
});

Template.App_model_add.events({
  'submit .modelAdd-model-add'(event) {
    event.preventDefault();

    const target = event.target;
    const title = target.title;
    const description = target.description;
    const file = target.file;
    const isPublic = target.public.checked;

		var reader = new FileReader();
		reader.onloadend = function(evt) {
			var buffer = evt.target.result;

			var binary = '';
			var bytes = new Uint8Array( buffer );
			var len = bytes.byteLength;
			for (var i = 0; i < len; i++) {
			    binary += String.fromCharCode( bytes[ i ] );
		  }

      Meteor.call('models.insert', Meteor.userId(), title.value, description.value, isPublic, (error, result) => {
        if (error) {
          alert(error.error);
        }
        else {
          Meteor.call('revisions.insert', result, title.value, description.value, btoa(binary), (errorRev, resultRev) => {
            if (error) {
              alert(errorRev.error);
            }
            else {
              console.log(resultRev);
              FlowRouter.go('Models.view', { _id: result });
            }
          });
        }
      });
    };

    reader.readAsArrayBuffer(file.files[0]);

  },
});
