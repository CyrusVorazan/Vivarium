import { Meteor } from 'meteor/meteor';
import './viewer.html';
import { Models } from '/imports/api/models/models.js';
import { Revisions } from '/imports/api/revisions/revisions.js';
import { Comments } from '/imports/api/comments/comments.js';
import { ActiveRoute } from 'meteor/zimme:active-route';

import THREE from 'three';
import { STLLoader } from './STLLoader.js';

var OrbitControls = require('three-orbit-controls')(THREE)

function render() {
	renderer.render( scene, camera );
}

function animate() {
    requestAnimationFrame( animate );
	controls.update();
	render();
}

Template.viewer.onRendered(function () {
	scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, 800 / 600, 1, 10000 );

	camera.position.set(30, 30, 30);
	camera.rotation.set(0, 0, 0);

	var size = 1000;
	var divisions = 100;
	gridHelper = new THREE.GridHelper( size, divisions );

	scene.add( gridHelper );

	scene.add( new THREE.HemisphereLight( 0x443333, 0x222233, 4 ) );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( 800, 600 );
	renderer.setClearColor(0xFFFFFF);

	raycaster = new THREE.Raycaster();

	controls = new OrbitControls(camera, renderer.domElement);
	controls.addEventListener( 'change', render );

	this.find('.3d-viewer').appendChild( renderer.domElement );
	animate();
	render();
});

Template.viewer.onCreated(function () {
	Meteor.subscribe('models.all', {
	  onReady: function () {
			if (ActiveRoute.name('Models.view')) {
		      var model = Models.findOne(FlowRouter.getParam('_id'));
					var revisionId = FlowRouter.getParam('_revisionId');

					Meteor.subscribe('revisions.all', {
					  onReady: function () {
								var revision;
								if (revisionId)
									revision = Revisions.findOne({ modelId: model._id, _id: revisionId });
								else
									revision = Revisions.findOne({ modelId: model._id });

								var buffer = atob(revision.file);

								var loader = new THREE.STLLoader();
								var geometry = loader.parse(buffer);
								var material = new THREE.MeshStandardMaterial( { color: Math.random() * 0xffffff } );
								var mesh = new THREE.Mesh( geometry, material );
								scene.add( mesh );

								Meteor.subscribe('comments.all');
						},
					  onError: function () { console.log("onError", arguments); }
					});
		  }
		},
	  onError: function () { console.log("onError", arguments); }
	});
});

Template.viewer.helpers({
  models() {
    return Models.find({});
  },
	revisions() {
		return Revisions.find({});
	},
	comments() {
		return Comments.find({});
	},
	userName(id) {
		return Meteor.users.findOne({_id: id}).emails[0].address;
	}
});

Template.viewer.events({
  'submit .revisions-revision-add'(event) {
    event.preventDefault();

    const target = event.target;
    const title = target.title;
    const file = target.file;

		var reader = new FileReader();

		reader.onloadend = function(evt) {

			var buffer = evt.target.result;

			var binary = '';
			var bytes = new Uint8Array( buffer );
			var len = bytes.byteLength;
			for (var i = 0; i < len; i++) {
			    binary += String.fromCharCode( bytes[ i ] );
		  }

	    Meteor.call('revisions.insert', FlowRouter.getParam('_id'), title.value, "", btoa(binary), (error) => {
	      if (error) {
	        alert(error.error);
	      } else {
	        title.value = '';
	        file.value = '';
	      }
	    });

			var loader = new THREE.STLLoader();
			var geometry = loader.parse(buffer);
			var material = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } );
			var mesh = new THREE.Mesh( geometry, material );
			scene.add( mesh );
    };

		reader.readAsArrayBuffer(file.files[0]);
  },
  'click .revlink'(event) {
    var link = event.currentTarget;
		FlowRouter.go(link.href);
  },
	'submit .comments-comment-add'(event) {
    event.preventDefault();

    const target = event.target;
    const text = target.text;

		var revisionId = FlowRouter.getParam('_revisionId');

		console.log(Meteor.userId());
		console.log(revisionId);

		if (!revisionId)
			revisionId = Revisions.findOne({ modelId: FlowRouter.getParam('_id') })._id;

    Meteor.call('comments.insert', Meteor.userId(), revisionId, text.value, (error) => {
      if (error) {
        alert(error.error);
      } else {
        text.value = '';
      }
    });
  }
});
