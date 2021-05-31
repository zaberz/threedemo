import * as THREE from 'three'

export const sideLong = 8
export const sideShort = 4
export const thickness = 0.2
export const textureLoader = new THREE.TextureLoader();

export function createBox() {
    const geometry = new THREE.BoxGeometry(sideLong, sideShort, sideShort)
    return new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({
        color: 0xAAAAAA,
        wireframe: true,
    }))
}

export function createSide(color = '#eee', width = sideLong, height = sideShort) {
    const geometry = new THREE.BoxGeometry(width, height, thickness)
    return new THREE.Mesh(geometry, new THREE.MeshStandardMaterial(
        {
            map: textureLoader.load('./mesh.svg'),
            metalness: 0.2,
            roughness: 0.07,
            doubleSided: true,
        })
    )
}

export function initDefaultLighting(scene, initialPosition) {
    const position = (initialPosition !== undefined) ? initialPosition : new THREE.Vector3(-10, 30, 40);
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.copy(position);
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.camera.fov = 15;
    spotLight.castShadow = true;
    spotLight.decay = 2;
    spotLight.penumbra = 0.05;
    spotLight.name = "spotLight"

    scene.add(spotLight);

    var ambientLight = new THREE.AmbientLight(0x343434);
    ambientLight.name = "ambientLight";
    scene.add(ambientLight);
}
