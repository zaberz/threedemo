<template>
  <div>
    <canvas id="canvas" ref="render"></canvas>
    <!--    <button id="run">run</button>-->
  </div>
</template>

<script>
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import TWEEN from '@tweenjs/tween.js'

export default {
  name: 'index',
  data() {
    return {
      width: 2,
      height: 1,
      depth: 1
    }
  },
  mounted() {
    this.initScene()

    // this.initSkeleton()
    // this.initTest()


    const {renderer, scene, camera} = this

    const self = this

    function animate() {
      requestAnimationFrame(animate);
      TWEEN.update();
      if (self.mixer != null) {
        let delta = self.clock.getDelta()
        self.mixer.update(delta);
      };
      // mixer.update( clock.getDelta() );

      render();
    }

    function render() {
      renderer.render(scene, camera);
    }
    animate()
  },

  methods: {
    initScene() {
      let scene = new THREE.Scene();
      scene.background = new THREE.Color( 0x444444 );
      const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

      // camera.position.z = 30;
      // camera.position.y = 30;
      let renderer = new THREE.WebGLRenderer({
        canvas: this.$refs['render'],
        antialias: true
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.position.z = 5;
      const axesHelper = new THREE.AxesHelper( 2 );
      scene.add( axesHelper );




      const controls = new OrbitControls( camera, renderer.domElement );
      controls.update();

      this.scene = scene
      this.camera = camera
      this.renderer = renderer

      let loader = new GLTFLoader()

      loader.load('./f.glb', (gltf)=>{
        // let c = gltf.scene.children[0]
        // c.rotation.x = 0.5
        console.log(gltf)
        scene.add(gltf.scene)


        // var clock = this.clock = new THREE.Clock();


        // var mixer = this.mixer =new THREE.AnimationMixer(gltf.scene);
        // mixer.clipAction(gltf.animations[0]).play();
        //
        // let skinnedMesh = gltf.scene.children[0].children[1]
        // console.log(skinnedMesh)
        // const helper = new THREE.SkeletonHelper( skinnedMesh );
        // helper.visible = false;
        //
        // scene.add( helper );

        // var mesh;
        // var mixer = this.mixer = new THREE.AnimationMixer( mesh );
        // var animations = gltf.animations; // 获取
        // var animation = THREE.AnimationClip.findByName(animations, "骨架Action");
        //
        // console.log(animation)
        // var action = mixer.clipAction( animation );
        // action.play();

      }, undefined, function (err){
        console.log(err)
      })


      // const x = 0, y = 0;
      // const heartShape = new THREE.Shape();
      // heartShape.moveTo( 0,0 );
      // heartShape.lineTo(1,0)
      // heartShape.lineTo(1,1)
      // heartShape.lineTo(1,2)
      // heartShape.lineTo(0,2)
      // heartShape.lineTo(0,1)
      //
      // const geometry = new THREE.ShapeGeometry( heartShape );
      // let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: "#f00"}))
      // mesh.rotation.x = 0.5
      // this.scene.add(mesh)
    },
    initSkeleton() {
      let obj = new THREE.PlaneGeometry(2,1, 2, 1)
      // let baseMesh = new THREE.MeshBasicMaterial({color: '#ccc', wireframe: false, side: THREE.DoubleSide})
      // let mesh = new THREE.Mesh(obj, baseMesh)

      const position = obj.attributes.position;


      let bone1 = new THREE.Bone()
      let bone2 = new THREE.Bone()

      bone1.position.x = 1
      bone2.position.x = 0
      bone1.add(bone2)
      let bones = [bone1, bone2]

      let material = new THREE.MeshBasicMaterial({
        skinning: true,
        color: 0x156289,
        emissive: 0x072534,
        side: true,
        flatShading: true
      })

      const mesh = new THREE.SkinnedMesh( obj,	material );
      const skeleton = new THREE.Skeleton( bones );
      mesh.add( bones[ 0 ] );
      mesh.bind( skeleton );

      let skeletonHelper = new THREE.SkeletonHelper( mesh );
      skeletonHelper.material.linewidth = 1;

      mesh.skeleton.bones[1].rotation.y = 0.5
      this.scene.add( skeletonHelper );
      this.scene.add(mesh)
    },

    initTest() {
      let {
        Bone,
        Color,
        CylinderGeometry,
        DoubleSide,
        Float32BufferAttribute,
        MeshPhongMaterial,
        PerspectiveCamera,
        PointLight,
        Scene,
        SkinnedMesh,
        Skeleton,
        SkeletonHelper,
        Vector3,
        Uint16BufferAttribute,
        WebGLRenderer
      }= THREE
      let gui, camera, renderer, orbit, lights, mesh, bones, skeletonHelper;
      let scene = this.scene

      initBones();

      function createGeometry( sizing ) {

        const geometry = new THREE.PlaneGeometry(
            1,
            2,
            1,
            2
        );

        const position = geometry.attributes.position;

        const vertex = new Vector3();

        const skinIndices = [];
        const skinWeights = [];

        console.log(position)
        for ( let i = 0; i < position.count; i ++ ) {

          vertex.fromBufferAttribute( position, i );


          console.log(vertex)
          const y = ( vertex.y + sizing.halfHeight );

          const skinIndex = Math.floor( y / sizing.segmentHeight );
          const skinWeight = 0; //( y % sizing.segmentHeight ) / sizing.segmentHeight;

          console.log(skinIndex, skinWeight)
          skinIndices.push( skinIndex, skinIndex + 1, 0, 0 );
          skinWeights.push( 1 - skinWeight, skinWeight, 0, 0 );

        }

        console.log(skinIndices, skinWeights)

        geometry.setAttribute( 'skinIndex', new Uint16BufferAttribute( skinIndices, 4 ) );
        geometry.setAttribute( 'skinWeight', new Float32BufferAttribute( skinWeights, 4 ) );


        console.log(geometry)
        return geometry;

      }

      function createBones( sizing ) {

        bones = [];

        let prevBone = new Bone();
        bones.push( prevBone );
        prevBone.position.y = - sizing.halfHeight;

        for ( let i = 0; i < sizing.segmentCount; i ++ ) {

          const bone = new Bone();
          bone.position.y = sizing.segmentHeight;
          bones.push( bone );
          prevBone.add( bone );
          prevBone = bone;

        }

        return bones;

      }

      function createMesh( geometry, bones ) {

        const material = new MeshPhongMaterial( {
          skinning: true,
          color: 0x156289,
          emissive: 0x072534,
          side: DoubleSide,
          flatShading: true
        } );

        const mesh = new SkinnedMesh( geometry,	material );
        const skeleton = new Skeleton( bones );

        mesh.add( bones[ 0 ] );

        mesh.bind( skeleton );

        skeletonHelper = new SkeletonHelper( mesh );
        skeletonHelper.material.linewidth = 2;
        scene.add( skeletonHelper );

        return mesh;

      }
      function initBones() {

        const segmentHeight = 8;
        const segmentCount = 2;
        const height = segmentHeight * segmentCount;
        const halfHeight = height * 0.5;

        const sizing = {
          segmentHeight: segmentHeight,
          segmentCount: segmentCount,
          height: height,
          halfHeight: halfHeight
        };

        const geometry = createGeometry( sizing );
        const bones = createBones( sizing );
        mesh = createMesh( geometry, bones );

        mesh.scale.multiplyScalar( 1 );
        scene.add( mesh );

      }

      bones[1].rotation.x = Math.PI /2
    },


    initTween() {
      const start = {value: 0};
      const finish = {value: Math.PI / 2};
      this.tween = new TWEEN
          .Tween(start)
          .to(finish, 3000)
          // .repeat(Infinity)
          // .repeatDelay(500)
          // .yoyo(true)
          .easing(TWEEN.Easing.Sinusoidal.InOut)
          .onUpdate(()=> {
            let angle = start.value;
            const  update = (obj)=>  {
              if (obj.children) {
                obj.children.forEach((item)=> {
                  if (item.userData) {
                    item.rotation[item.userData.axis] = item.userData.type === 'plus' ? angle : -angle
                  }
                  update(item)
                })
              }
            }

            update(this.baseItem)
          })
          .start();
    },
    createObject(config) {
      let defaultConfig = {
        width: 1,
        height: 1,
        depth: 1,
        related: '',
        direction: '',
        color: '#fff'
      }
      config = {...defaultConfig, ...config}

      let obj = new THREE.PlaneGeometry(config.width, config.height)
      let mesh = new THREE.Mesh(obj, new THREE.MeshBasicMaterial({color: config.color, wireframe: false, side: THREE.DoubleSide}));

      if (config.related) {
        config.related.add(mesh)
        if (config.direction === 'left') {
          obj.translate(-config.width/2, 0 ,0)
          mesh.position.set( -config.related.geometry.parameters.width /2, 0,0)
          mesh.userData = {
            axis: 'y',
            type: 'plus'
          }
        }else if (config.direction === 'right') {
          obj.translate(config.width/2, 0 ,0)
          mesh.position.set( config.related.geometry.parameters.width /2, 0,0)
          mesh.userData = {
            axis: 'y',
            type: 'minus'
          }
        }else if (config.direction === 'bottom') {
          obj.translate(0, -config.height/2 ,0)
          mesh.position.set( 0,-config.related.geometry.parameters.height /2, 0)
          mesh.userData = {
            axis: 'x',
            type: 'minus'
          }
        }else if (config.direction === 'top') {
          // obj.translate(0, config.height/2 ,0)
          mesh.position.set( 0,config.related.geometry.parameters.height /2, 0)
          mesh.userData = {
            axis: 'x',
            type: 'plus'
          }
        }
      }


      return mesh
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