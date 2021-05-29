<template>
    <div>
        <canvas id="canvas" ref="render"></canvas>
        <!--    <button id="run">run</button>-->
    </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import TWEEN from '@tweenjs/tween.js'
import { createSide, createBox, sideLong, sideShort, initDefaultLighting } from '@/lib'

export default {
    name: 'index',
    mounted() {
        let scene = new THREE.Scene()

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.x = 2;
        camera.position.y = -25.83337550545299;
        camera.position.z = 30.25160353506808;
        camera.lookAt(scene.position);

        let renderer = new THREE.WebGLRenderer({
            canvas: this.$refs['render'],
            antialias: true,
        })
        renderer.setSize(window.innerWidth, window.innerHeight)
        const axesHelper = new THREE.AxesHelper(30)
        scene.add(axesHelper)
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.update()
        initDefaultLighting(scene, new THREE.Vector3(-10, 20, 40))
        scene.add(new THREE.AmbientLight(0x444444));

        init()
        animate()

        function init() {
            const rootSide = createSide('#cccccc')
            const leftSide = createSide('#ff0000')
            const rightSide = createSide('#00ff00')
            const bottomSide = createSide('#0000ff', sideLong, sideLong)
            const topSide = createSide('#ffffff', sideLong, sideLong)
            const topChildrenSide = createSide('#ffff00', sideLong, sideShort);
            topSide.add(topChildrenSide)
            topChildrenSide.geometry.translate(0, sideShort / 2, 0)
            topChildrenSide.position.set(0, sideLong, 0)

            const box = createBox()
            scene.add(box)
            box.position.set(sideLong, 0, sideShort / 2)
            const aroundSideList = [
                leftSide,
                rightSide,
                bottomSide,
                topSide
            ]
            rootSide.position.set(sideLong * 2, 0, 0)
            leftSide.geometry.translate(-sideLong / 2, 0, 0)
            leftSide.position.set(-sideLong / 2, 0, 0)
            rightSide.geometry.translate(sideLong / 2, 0, 0)
            rightSide.position.set(sideLong / 2, 0, 0)
            bottomSide.geometry.translate(0, -sideLong / 2, 0)
            bottomSide.position.set(0, -sideShort / 2, 0)
            topSide.geometry.translate(0, sideLong / 2, 0)
            topSide.position.set(0, sideShort / 2, 0)

            aroundSideList.forEach(side => rootSide.add(side))
            scene.add(rootSide)

            var start = { value: 0 }
            var finish = { value: Math.PI / 2 }
            var angle = 0
            new TWEEN.Tween(start).to(finish, 3000).
                repeat(Infinity).
                repeatDelay(1000).
                yoyo(true).
                easing(TWEEN.Easing.Sinusoidal.InOut).
                onUpdate(function() {
                    angle = start.value
                    leftSide.rotation.y = angle
                    rightSide.rotation.y = -angle
                    bottomSide.rotation.x = -angle
                    topSide.rotation.x = angle
                    topChildrenSide.rotation.x = angle
                }).
                start()
        }
        function animate() {
            requestAnimationFrame(animate)
            TWEEN.update()
            render()
        }
        function render() {
            renderer.render(scene, camera)
        }
    },
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
}
</style>
