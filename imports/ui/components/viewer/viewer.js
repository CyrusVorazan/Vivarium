import { Meteor } from 'meteor/meteor';
import './viewer.html';
import { Models } from '/imports/api/models/models.js';

import THREE from 'three';
import { STLLoader } from './STLLoader.js';

var OrbitControls = require('three-orbit-controls')(THREE)

function render() {
	renderer.render( scene, camera );
}

function animate() {
    requestAnimationFrame( animate );
	//mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.02;
	controls.update();
	render();
}

Template.viewer.onRendered(function () {
	scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, 800 / 600, 1, 10000 );
    camera.position.z = 50;
    geometry = new THREE.BoxGeometry( 10, 10, 10 );
    material = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } );
    mesh = new THREE.Mesh( geometry, material );

	var size = 1000;
	var divisions = 100;
	gridHelper = new THREE.GridHelper( size, divisions );

	scene.add( gridHelper );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( 800, 600 );

	raycaster = new THREE.Raycaster();

	controls = new OrbitControls(camera, renderer.domElement);
	controls.addEventListener( 'change', render );

	this.find('.3d-viewer').appendChild( renderer.domElement );
	animate();
	render();
});

Template.viewer.onCreated(function () {
  Meteor.subscribe('models.all');
});

Template.viewer.helpers({
  models() {
    return Models.find({});
  },
});

Template.viewer.events({
  'submit .modelList-link-add'(event) {
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

	    Meteor.call('models.insert', title.value, btoa(binary), (error) => {
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
});
