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
import { createSide, initDefaultLighting, sideLong, sideShort } from '@/lib'
import dat from 'dat.gui'
import { thickness } from './lib'
import { addModelLabels } from '@/lib/label'

export default {
    name: 'index',
    mounted() {
        let self = this
        let scene = new THREE.Scene()

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.x = 2
        camera.position.y = -15.83337550545299
        camera.position.z = 40.25160353506808
        camera.lookAt(scene.position)

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
        scene.add(new THREE.AmbientLight(0x444444))

        init(sideLong, sideShort, thickness)
        animate()
        render()

        function init(sideLong, sideShort, thickness) {
            if (self.rootSide) {
                scene.remove(self.rootSide)
            }

            const rootSide = createSide('#cccccc', sideLong, sideShort)
            const leftSide = createSide('#ff0000', sideLong, sideShort)
            const rightSide = createSide('#00ff00', sideLong, sideShort)
            const bottomSide = createSide('#0000ff', sideLong, sideLong)
            const topSide = createSide('#ffffff', sideLong, sideLong)
            const topChildrenSide = createSide('#ffff00', sideLong, sideShort)
            topSide.add(topChildrenSide)
            topChildrenSide.geometry.translate(0, sideShort / 2, 0)
            topChildrenSide.position.set(0, sideLong, 0)

            addModelLabels(scene)

            const aroundSideList = [
                leftSide,
                rightSide,
                bottomSide,
                topSide,
            ]
            rootSide.position.set(0, 0, 0)
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

            self.rootSide = rootSide

            const start = { value: 2 }
            const finish = { value: 10 }
            const angle = Math.PI / 2
            leftSide.rotation.y = angle
            rightSide.rotation.y = -angle
            bottomSide.rotation.x = -angle
            topSide.rotation.x = angle
            topChildrenSide.rotation.x = angle
            new TWEEN.Tween(start).to(finish, 3000).
                repeat(Infinity).
                repeatDelay(1000).
                yoyo(true).
                easing(TWEEN.Easing.Sinusoidal.InOut).
                onUpdate(function() {
                    // const angle = start.value
                    // camera.position.x = start.value
                    // leftSide.rotation.y = angle
                    // rightSide.rotation.y = -angle
                    // bottomSide.rotation.x = -angle
                    // topSide.rotation.x = angle
                    // topChildrenSide.rotation.x = angle
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

        // initDatGui()

        function initDatGui() {
            let gui = new dat.GUI({
                name: 'MY GUI',
            })
            const option = {
                width: 8,
                height: 4,
                depth: 1,
            }

            let a = gui.add(option, 'width', 1, 10)
            let b = gui.add(option, 'height', 1, 10)
            let c = gui.add(option, 'depth', 1, 10)
            a.onFinishChange(datChange)
            b.onFinishChange(datChange)
            c.onFinishChange(datChange)

            function datChange(res) {
                init(option.width, option.height, option.depth)
            }

            console.log(gui)
            // gui.onChange((res)=> {
            //   console.log(res)
            // })
        }
    },
    methods: {},
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
}
</style>
