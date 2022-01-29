import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
// const gltfLoader = new GLTFLoader()
// gltfLoader.load(
//     '/glTF/Fox.gltf',
//     (gltf) =>
//     {
//         let box = gltf.scene.children[0];
//         console.log(box);
//         box.scale.set(0.25, 0.25, 0.25)
//         // scene.add(box)
//     }
// )

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(100, 100),
    new THREE.MeshStandardMaterial({ roughness: 0.7 })
)
plane.receiveShadow = true
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 15
plane.position.z = - 20
scene.add(plane);

const numShapes = 1800;
const materialCommonProperties = {
    // wireframe: true,
    side: THREE.DoubleSide,
};

const materials = [
    new THREE.MeshPhysicalMaterial({
        color: 0xdbdbdb,
        roughness: 0.25,
        metalness: 0.06,
        reflectivity: 0.6,
        clearcoat: 0.7,
        clearcoatRoughness: 0.5,
        ...materialCommonProperties
    }),
    new THREE.MeshPhysicalMaterial({
        // color: 0xdf9595,
        color: 0x74effc,
        roughness: 0.25,
        metalness: 0,
        reflectivity: 0.09,
        clearcoat: 0.2,
        clearcoatRoughness: 0.45,
        ...materialCommonProperties
    }),
    new THREE.MeshPhysicalMaterial({
        color: 0xd12d10,
        roughness: 0.326,
        metalness: 0.0237,
        reflectivity: 0,
        clearcoat: 0,
        clearcoatRoughness: 0,
        ...materialCommonProperties
    }),
];

// Box
const box = new THREE.Mesh(
    // new THREE.BoxBufferGeometry(2, 5, 2),
    new THREE.TorusBufferGeometry( 10, 3, 16, 100 ),
    new THREE.MeshStandardMaterial({
        color: 0xff0000,
        // wireframe: true,
    })
    // materials[0]
)
// box.castShadow = true;
// scene.add(box);

let currentIdx = 0;

const boxIndexes = box.geometry.index.array;
const boxVertices = box.geometry.attributes.position.array;
for (let i = 0; i < numShapes; i++) {
    const geometry = new THREE.BufferGeometry();
    let indices = [];
    const vertices = 6//Math.floor((Math.random() + 3) * 2);
    const numVerticesData = vertices*3;
    const positions = new Float32Array(numVerticesData);
    
    // const x = (Math.random()/2) * 4;
    // const y = (Math.random()/2) * 4;
    // const z = (Math.random()/2) * 4;
    
    for (let v = 0; v < vertices; v++) {
        const _i = boxIndexes[currentIdx]*3;
        positions[3 * v] = boxVertices[_i] + ((Math.random() - 0.5) * 1);
        positions[(3*v) + 1] = boxVertices[_i + 1] + (Math.random() - 0.5);
        positions[(3*v) + 2] = boxVertices[_i + 2] + (Math.random() - 0.5);
        currentIdx++;
        if (currentIdx === boxIndexes.length) {
            currentIdx = 0;
            break;
        }
    }
    let hash = {};
    let maxTries = 10;
    for (let x = 0; x<vertices; x++) {
        // let pos = Math.floor(Math.random() * (vertices-1));
        // indices.push(pos);
        // indices
        let i1 = Math.floor(Math.random() * (vertices-1)),
            i2 = Math.floor(Math.random() * (vertices-1)),
            i3 = Math.floor(Math.random() * (vertices-1));
        let faceIndices = Array.from(new Set([i1, i2, i3]));
        let tries = 0;
        while (faceIndices.length < 3 && tries<maxTries) {
            faceIndices.push(Math.floor(Math.random() * (vertices-1)));
            faceIndices = Array.from(new Set(faceIndices));
            tries++;

            if (tries==10) console.log("I CAN'T DO THIS ANYMORE!");
        }
        indices = indices.concat(faceIndices);
    }

    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    geometry.normalizeNormals();

    const m = Math.floor(Math.random() * materials.length)
    const shape = new THREE.Mesh(geometry, materials[m])
    shape.castShadow = true;
    shape.receiveShadow = true;

    scene.add(shape);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0x505050, 1)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('white', 1)
moonLight.castShadow = true;
moonLight.shadow.camera.top = 20
moonLight.shadow.camera.right = 20
moonLight.shadow.camera.bottom = - 20
moonLight.shadow.camera.left = - 20
moonLight.shadow.mapSize.width = 1024
moonLight.shadow.mapSize.height = 1024
moonLight.shadow.camera.near = 0.1
moonLight.shadow.camera.far = 100
moonLight.position.set(10, 15, 30)
moonLight.lookAt(10, 5, 0)
const helper = new THREE.DirectionalLightHelper( moonLight, 5 );
helper.visible = true;
helper.color = 0xff0000;
scene.add(moonLight)

const cameraHelper = new THREE.CameraHelper(moonLight.shadow.camera)
scene.add( helper, cameraHelper );
// window.requestAnimationFrame(() =>
// {
//     helper.position.copy(rectAreaLight.position)
//     helper.quaternion.copy(rectAreaLight.quaternion)
//     helper.update()
// })

/**
 * Fog
 */
// const fog = new THREE.Fog('#262837', 1, 15)
// scene.fog = fog

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
// camera.position.x = 4
camera.position.y = 20
camera.position.z = 25

scene.add(camera);
// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearColor('#fcf7e8')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
// const clock = new THREE.Clock()

const tick = () =>
{
    // const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update( );

    helper.update();
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()