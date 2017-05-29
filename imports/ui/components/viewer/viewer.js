import { Meteor } from 'meteor/meteor';
import './viewer.html';
import { Models } from '/imports/api/models/models.js';
import { Revisions } from '/imports/api/revisions/revisions.js';
import { Comments } from '/imports/api/comments/comments.js';
import { Collaborators } from '/imports/api/collaborators/collaborators.js';
import { ActiveRoute } from 'meteor/zimme:active-route';

import THREE from 'three';
import { STLLoader } from './STLLoader.js';

var OrbitControls = require('three-orbit-controls')(THREE)

function render() {
	renderer.render( scene, camera );
	renderer2.render( scene2, camera );
}

function animate() {
  requestAnimationFrame( animate );
	controls.update();
	render();
}

Template.viewer.onRendered(function () {
	scene = new THREE.Scene();
	scene2 = new THREE.Scene();

	var element = this.find('.3d-viewer').parentElement;

	var styles = window.getComputedStyle(element);
  var padding = parseFloat(styles.paddingLeft) +
                parseFloat(styles.paddingRight);

  var width = element.clientWidth - padding;
	var height = width * 3 / 4 - parseFloat(styles.paddingBottom);

  camera = new THREE.PerspectiveCamera( 75, width / height, 1, 10000 );

	camera.position.set(30, 30, 30);
	camera.rotation.set(0, 0, 0);

	var size = 1000;
	var divisions = 100;
	gridHelper = new THREE.GridHelper( size, divisions );
	scene.add( gridHelper );
	gridHelper2 = new THREE.GridHelper( size, divisions );
	scene2.add( gridHelper2 );
	scene.add( new THREE.HemisphereLight( 0x333333, 0x222222, 4 ) );
	scene2.add( new THREE.HemisphereLight( 0x333333, 0x222222, 4 ) );

  renderer = new THREE.WebGLRenderer();
	renderer2 = new THREE.WebGLRenderer();
  renderer.setSize( width, height );
	renderer2.setSize( 0, 0 );
	//renderer2.domElement.style = "{hidden;}"
	renderer.setClearColor(0xFFFFFF);
	renderer2.setClearColor(0xFFFFFF);

	raycaster = new THREE.Raycaster();

	controls = new OrbitControls(camera, this.find('.3d-viewers'));
	controls.keys = {};
	controls.addEventListener( 'change', render );

	this.find('.3d-viewer').appendChild( renderer.domElement );
	this.find('.3d-viewer-2').appendChild( renderer2.domElement );
	window.onresize = function() {
		var styles = window.getComputedStyle(element);
	  var padding = parseFloat(styles.paddingLeft) +
	                parseFloat(styles.paddingRight);

	  var width = element.clientWidth - padding;
		var height = width * 3 / 4 - parseFloat(styles.paddingBottom);

		if (renderer2.getSize().width == 0 && renderer2.getSize().height == 0) {
			renderer.setSize( width, height );
		}
		else {
			renderer.setSize( width, height/2 );
			renderer2.setSize( width, height/2 );
			camera.aspect = width/(height/2);
			camera.updateProjectionMatrix();
		}
	};
	animate();
	render();
});

Template.viewer.onCreated(function () {
	this.getModelId = () => FlowRouter.getParam('_id');
	this.getRevisionID = () => FlowRouter.getParam('_revisionId');

	this.autorun(() => {
		this.subscribe('models.current', this.getModelId());
		this.subscribe('models.users');
		this.subscribe('collaborators.inModel', this.getModelId());
		var modelId = this.getModelId();
		var revisionId = this.getRevisionID();

		this.subscribe('revisions.inModel', this.getModelId(), {
			onReady: function () {
					var revision;
					if (revisionId)
						revision = Revisions.findOne({ _id: revisionId });
					else
						revision = Revisions.findOne({});

					FlowRouter.setParams({_id: modelId, _revisionId: revision._id});

					var buffer = atob(revision.file);

					var loader = new THREE.STLLoader();
					var geometry = loader.parse(buffer);
					var material = new THREE.MeshStandardMaterial( { color: [1,1,1],
		        wireframe: false,
		        side: THREE.DoubleSide } );
					var mesh = new THREE.Mesh( geometry, material );
					scene.add( mesh );

					Meteor.subscribe('comments.inRevision', revision._id);
			},
			onError: function () { console.log("onError", arguments); }
		});
	});
});

Template.viewer.helpers({
	collaboratorsLoaded: () => Revisions.find().count(),
	revisionsLoaded: () => Revisions.find().count(),
	modelLoaded: () => Models.find().count(),
	commentsLoaded: () => Comments.find().count(),
	revisions() {
		return Revisions.find({modelId: FlowRouter.getParam('_id')});
	},
	collaborators() {
		return Collaborators.find({modelId: FlowRouter.getParam('_id')});
	},
	comments() {
		var revisionId = FlowRouter.getParam('_revisionId');
		if (!revisionId)
			revisionId = Revisions.findOne({ modelId: FlowRouter.getParam('_id') })._id;
		return Comments.find({revisionId: revisionId}, { /*limit: limit || 10,*/ sort: {createdAt: -1} });
	},
	userName(id) {
		return Meteor.users.findOne({_id: id}).emails[0].address;
	},
	modelName(id) {
		return Models.findOne({ _id: FlowRouter.getParam('_id') }).title;
	},
	isOwner() {
		if (Models.find().count())
			return (Models.findOne({ _id: FlowRouter.getParam('_id') }).userId == Meteor.userId());
		else
			return false;
	},
	canView() {
		if (Models.find().count()) {
			const model = Models.findOne({ _id: FlowRouter.getParam('_id') });
			if (model.isPublic)
				return true;
			if (model.userId == Meteor.userId())
				return true;
			if (Collaborators.find().count()) {
				const collabs = Collaborators.find({ modelId: model._id, userId: Meteor.userId() });
				if (collabs.count() > 0)
					return true;
			}
		}

		return false;
	},
	canComment() {
		if (Models.find().count()) {
			const model = Models.findOne({ _id: FlowRouter.getParam('_id') });
			if (model.isPublic && Meteor.user())
				return true;
			if (model.userId == Meteor.userId())
				return true;
			if (Collaborators.find().count()) {
				const collabs = Collaborators.find({ modelId: model._id, userId: Meteor.userId() });
				if (collabs.count() > 0)
					return true;
			}
		}

		return false;
	},
	needDelete() {
		if (Models.find().count()) {
			// Is owner and has more than 1 revision
			return (Models.findOne({ _id: FlowRouter.getParam('_id') }).userId == Meteor.userId() &&
					Revisions.find({modelId: FlowRouter.getParam('_id')}).count() > 1);
		}

		return false;
	},
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

			/* Load new revision - either don't do this, or cleanup the old one
				var loader = new THREE.STLLoader();
				var geometry = loader.parse(buffer);
				var material = new THREE.MeshStandardMaterial( { color: [1,1,1],
					wireframe: false,
					side: THREE.DoubleSide } );
				var mesh = new THREE.Mesh( geometry, material );
				scene.add( mesh );
			*/
    };

		reader.readAsArrayBuffer(file.files[0]);
  },
	'click .collabdelete'(event) {
    var collab = event.currentTarget;
		Meteor.call('collaborators.remove', FlowRouter.getParam('_id'), collab.name, (error) => {
      if (error) {
        alert(error.error);
      } else {
      }
    });
  },
	'click .comment-add'(event) {
    event.preventDefault();

    const target = event.target.parentNode;
    const text = target.text;

		var revisionId = FlowRouter.getParam('_revisionId');

		if (!revisionId)
			revisionId = Revisions.findOne({ modelId: FlowRouter.getParam('_id') })._id;

    Meteor.call('comments.insert', Meteor.userId(), revisionId, text.value, (error) => {
      if (error) {
        alert(error.error);
      } else {
        text.value = '';
      }
    });
  },
	'submit .model-collaborator-add'(event) {
		event.preventDefault();

    const target = event.target;
    const email = target.email;

		const user = Meteor.users.findOne({ emails: [{"address": email.value,"verified": true}] });

		if (!user) {
			alert("Please input the email address of an existing user");
			return;
		}
		const existing = Collaborators.findOne({ modelId: FlowRouter.getParam('_id'), userId: user._id });
		if (existing)
			return;

		Meteor.call('collaborators.insert', FlowRouter.getParam('_id'), user._id, (error) => {
      if (error) {
        alert(error.error);
      } else {
        email.value = '';
      }
    });
	},
	'click .twoway'(event) {
    var cbox = event.currentTarget;

		var element = Template.instance().find('.3d-viewer').parentElement;

		var styles = window.getComputedStyle(element);
		var padding = parseFloat(styles.paddingLeft) +
									parseFloat(styles.paddingRight);

		var width = element.clientWidth - padding;
		var height = width * 3 / 4 - parseFloat(styles.paddingBottom);

		if (cbox.checked) {
			renderer.setSize( width, height/2 );
			renderer2.setSize( width, height/2 );
			camera.aspect = width/(height/2);
			camera.fov = 45;
    	camera.updateProjectionMatrix();

			const revision = Revisions.findOne();
			var buffer = atob(revision.file);
			var loader = new THREE.STLLoader();
			var geometry = loader.parse(buffer);
			var material = new THREE.MeshStandardMaterial( { color: [1,1,1],
				wireframe: false,
				side: THREE.DoubleSide } );
			var mesh = new THREE.Mesh( geometry, material );
			scene2.add( mesh );
		}
		else {
			renderer2.setSize( 0, 0 );
			renderer.setSize( width, height );
			camera.aspect = width/height;
			camera.fov = 75;
    	camera.updateProjectionMatrix();
			for (i = scene2.children.length - 1; i >= 0; i--) {
			    if (scene2.children[i].type === "Mesh") {
						var obj = scene2.children[i];
						scene2.remove(scene2.children[i]);
						obj.geometry.dispose();
						obj.material.dispose();
					}
			}
		}
  },
	'click .revisionup'(event) {
		var rev = event.currentTarget.name;
		const revision = Revisions.findOne(rev);

		FlowRouter.setParams({_id: revision.modelId, _revisionId: rev});

		var buffer = atob(revision.file);
		var loader = new THREE.STLLoader();
		var geometry = loader.parse(buffer);
		var material = new THREE.MeshStandardMaterial( { color: [1,1,1], wireframe: false, side: THREE.DoubleSide } );
		var mesh = new THREE.Mesh( geometry, material );

		for (i = scene.children.length - 1; i >= 0; i--) {
				if (scene.children[i].type === "Mesh") {
					var obj = scene.children[i];
					scene.remove(scene.children[i]);
					obj.geometry.dispose();
					obj.material.dispose();
				}
		}

		scene.add( mesh );
	},
	'click .revisiondown'(event) {
		var rev = event.currentTarget.name;
		const revision = Revisions.findOne(rev);
		var buffer = atob(revision.file);
		var loader = new THREE.STLLoader();
		var geometry = loader.parse(buffer);
		var material = new THREE.MeshStandardMaterial( { color: [1,1,1], wireframe: false, side: THREE.DoubleSide } );
		var mesh = new THREE.Mesh( geometry, material );

		for (i = scene2.children.length - 1; i >= 0; i--) {
				if (scene2.children[i].type === "Mesh") {
					var obj = scene2.children[i];
					scene2.remove(scene2.children[i]);
					obj.geometry.dispose();
					obj.material.dispose();
				}
		}

		scene2.add( mesh );
	},
	'click .revisiondelete'(event) {
		var rev = event.currentTarget.name;
		Meteor.call('revisions.remove', rev, (error) => {
      if (error) {
        alert(error.error);
      } else {
      }
    });
	},
});
