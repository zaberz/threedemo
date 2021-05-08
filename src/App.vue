<template>
  <div>
    <canvas id="canvas" ref="render"></canvas>
<!--    <button id="run">run</button>-->
  </div>
</template>

<script>
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import TWEEN from '@tweenjs/tween.js'
export default {
  name: 'index',
  mounted() {
    let scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    let renderer = new THREE.WebGLRenderer({
      canvas: this.$refs['render'],
      antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;
    const axesHelper = new THREE.AxesHelper( 2 );
    scene.add( axesHelper );
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.update();

    // var camera, scene, renderer, controls;
    var sides = [];
    init();
    animate();

    function init() {

      //sides
      var geom = new THREE.PlaneGeometry(1,1);
      var side0 = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({color: "#eee", wireframe: false, side: THREE.DoubleSide}));
      scene.add(side0);

      var side1Geom = new THREE.PlaneGeometry(1,1);
      side1Geom.translate(-0.5,0,0);
      var side1 = new THREE.Mesh(side1Geom, new THREE.MeshBasicMaterial({color: "#ddd", wireframe: false, side: THREE.DoubleSide}));
      sides.push(side1);

      var side2 = side1.clone(); sides.push(side2);
      side2.material = new THREE.MeshBasicMaterial({color: "#ccc", side: THREE.DoubleSide});
      var side3 = side1.clone(); sides.push(side3);
      side3.material = new THREE.MeshBasicMaterial({color: "#bbb", side: THREE.DoubleSide});
      var side4 = side1.clone(); sides.push(side4);
      side4.material = new THREE.MeshBasicMaterial({color: "#aaa", side: THREE.DoubleSide});
      var side5 = side1.clone(); sides.push(side5);
      side5.material = new THREE.MeshBasicMaterial({color: "#999", side: THREE.DoubleSide});


      // hierarchy
      side1.position.set(-0.5,0,0); side0.add(side1);
      side2.position.set(0,-0.5,0); side2.rotation.z = Math.PI / 2; side0.add(side2);
      side3.position.set(0.5,0,0); side3.rotation.z = Math.PI; side0.add(side3);
      side4.position.set(-0.5,-0.5,0); side4.rotation.z = Math.PI / 2; side3.add(side4);
      side5.position.set(-0.5,0.5,0); side5.rotation.z = -Math.PI / 2; side4.add(side5);

      var start = {value: 0};
      var finish = {value: Math.PI / 2};
      var angle = 0;
      new TWEEN
          .Tween(start)
          .to(finish, 3000)
          .repeat(Infinity)
          .repeatDelay(500)
          .yoyo(true)
          .easing(TWEEN.Easing.Sinusoidal.InOut)
          .onUpdate(function(){
            angle = start.value;

            sides[0].rotation.y = angle;
            sides[1].rotation.x = -angle;
            sides[2].rotation.y = -angle;
            sides[3].rotation.x = -angle;
            sides[4].rotation.x = angle;
          })
          .start();
    }

    /*function foldTheCube(){

    }*/

// animate
    function animate() {
      requestAnimationFrame(animate);
      TWEEN.update();
      render();
    }
    function render() {
      renderer.render(scene, camera);
    }



  }
}



</script>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
