import { Meteor } from 'meteor/meteor';
import './viewer.html';

import Three from 'three';
var OrbitControls = require('three-orbit-controls')(Three)

function render() {
	renderer.render( scene, camera );
}

function animate() {
    requestAnimationFrame( animate );
	mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
	controls.update();
	render();
}

Template.viewer.onRendered(function () {
	scene = new Three.Scene();
    camera = new Three.PerspectiveCamera( 75, 800 / 600, 1, 10000 );
    camera.position.z = 50;
    geometry = new Three.BoxGeometry( 10, 10, 10 );
    material = new Three.MeshBasicMaterial( { color: Math.random() * 0xffffff } );
    mesh = new Three.Mesh( geometry, material );
	
	var size = 1000; 
	var divisions = 100; 
	gridHelper = new Three.GridHelper( size, divisions );
	
	scene.add( gridHelper );
    scene.add( mesh );
	
    renderer = new Three.WebGLRenderer();
    renderer.setSize( 800, 600 );
	
	raycaster = new Three.Raycaster();

	controls = new OrbitControls(camera, renderer.domElement);
	controls.addEventListener( 'change', render );
 
	this.find('.3d-viewer').appendChild( renderer.domElement );
	animate();
	render();
});

Template.viewer.onCreated(function () {
  
});

Template.viewer.helpers({
	
});

Template.viewer.events({
	
});
