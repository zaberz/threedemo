import * as THREE from 'three'
import svg1 from '../assets/1-1.svg'
import svg2 from '../assets/1-2.svg'
import svg3 from '../assets/1-3.svg'

export function addModelLabels(scene) {
    addLabel({
        scene,
        labelStartPoint: [3.5, -2.2, 2.5],
        labelEndPoint: [10, -5, 12],
        imageSrc: svg1,
    })
    addLabel({
        scene,
        labelStartPoint: [-2, -2.2, 5],
        labelEndPoint: [-5, -5, 5],
        imageSrc: svg2,
    })
    addLabel({
        scene,
        labelStartPoint: [3.5, -1.5, 8],
        labelEndPoint: [-5, -2, 9],
        imageSrc: svg3,
    })
}

export function addLabel({ scene, labelStartPoint, labelEndPoint, imageSrc }) {
    const color = 0x4b8fea
    const material = new THREE.LineBasicMaterial({ color, linewidth: 10 })
    const points = [
        new THREE.Vector3(...labelStartPoint),
        new THREE.Vector3(...labelEndPoint),
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.Line(geometry, material)
    scene.add(line)

    //定义第一个标签
    const texture = new THREE.TextureLoader().load(imageSrc)
    const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        color: 0xffffff,
    })
    const sprite = new THREE.Sprite(spriteMaterial)
    sprite.position.set(...labelEndPoint)
    sprite.scale.set(3, 1, 0)
    scene.add(sprite)

    //定义标记点
    const radius = 0.18, segment = 16, rings = 16
    const sphereMaterial = new THREE.MeshLambertMaterial({ color })
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, segment, rings), sphereMaterial)
    mesh.position.set(...labelStartPoint)
    scene.add(mesh)

    const group = new THREE.Object3D()
    group.add(line)
    group.add(sprite)
    group.add(mesh)
    scene.add(group)
}

