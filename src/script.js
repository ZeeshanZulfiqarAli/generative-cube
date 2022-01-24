import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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
 * Textures
 */
// const textureLoader = new THREE.TextureLoader()

/**
 * House
 */
// House container
const house = new THREE.Group()
scene.add(house)


// console.log(box)


const numShapes = 7;
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
        color: 0xdf9595,
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
    new THREE.BoxBufferGeometry(2, 5, 2),
    new THREE.MeshStandardMaterial({
        color: 0xff0000,
        wireframe: true,
    })
    // materials[0]
)
scene.add(box);
console.log(box);

let currentIdx = 0;
const boxIndexes = box.geometry.index.array;
const boxVertices = box.geometry.attributes.position.array;
for (let i = 0; i < numShapes; i++) {
    const geometry = new THREE.BufferGeometry();
    let indices = [1, 5, 2];
    const vertices = 6//Math.floor((Math.random() + 3) * 2);
    const numVerticesData = vertices*3;
    const positions = new Float32Array(numVerticesData);
    console.log(vertices, positions);
    
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
    for (let x = 0; x<4; x++) {
        let i1 = Math.floor(Math.random() * (vertices-1)),
            i2 = Math.floor(Math.random() * (vertices-1)),
            i3 = Math.floor(Math.random() * (vertices-1));
        indices = indices.concat([i1, i2, i3]);
    }
    // positions.
    console.log(indices);
    // geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    geometry.normalizeNormals();

    const m = Math.floor(Math.random() * materials.length)
    console.log('m', m, materials.length)
    const shape = new THREE.Mesh(geometry, materials[m])
    // shape.position.x = 0;
    console.log()
    scene.add(shape);
}



const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array( [
	-1.0, -1.0,  1.0,
	 1.0, -1.0,  1.0,
	 1.0,  1.0,  1.0,

	//  1.0,  1.0,  1.0,
	-1.0,  1.0,  1.0,
	// -1.0, -1.0,  1.0
] );

const indices = [0, 1, 2, 2, 3, 0];
// // itemSize = 3 because there are 3 values (components) per vertex
geometry.setIndex( indices );
geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
geometry.computeVertexNormals();
// const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const mesh = new THREE.Mesh( geometry, materials[0] );
mesh.position.z = 3;
scene.add(mesh)
// walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
// walls.position.y = 1.25

// Graves
// const graves = new THREE.Group()
// scene.add(graves)

// const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.1)
// const graveMaterial = new THREE.MeshStandardMaterial({ color: '#727272' })

// for(let i = 0; i < 50; i++)
// {
//     const angle = Math.random() * Math.PI * 2 // Random angle
//     const radius = 3 + Math.random() * 6      // Random radius
//     const x = Math.cos(angle) * radius        // Get the x position using cosinus
//     const z = Math.sin(angle) * radius        // Get the z position using sinus

//     // Create the mesh
//     const grave = new THREE.Mesh(graveGeometry, graveMaterial)
//     grave.castShadow = true

//     // Position
//     grave.position.set(x, 0.3, z)                              

//     // Rotation
//     grave.rotation.z = (Math.random() - 0.5) * 0.4
//     grave.rotation.y = (Math.random() - 0.5) * 0.4

//     // Add to the graves container
//     graves.add(grave)
// }

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0x505050, 1)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('white', 2)
moonLight.castShadow = true
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
// moonLight.shadow.camera.far = 15
moonLight.position.set(10, 15, 30)
moonLight.lookAt(10, 5, 0)
const helper = new THREE.DirectionalLightHelper( moonLight, 5 );
scene.add(moonLight)

scene.add( helper );
// window.requestAnimationFrame(() =>
// {
//     helper.position.copy(rectAreaLight.position)
//     helper.quaternion.copy(rectAreaLight.quaternion)
//     helper.update()
// })
// // Door light
// const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
// doorLight.castShadow = true
// doorLight.shadow.mapSize.width = 256
// doorLight.shadow.mapSize.height = 256
// doorLight.shadow.camera.far = 7

// doorLight.position.set(0, 2.2, 2.7)
// house.add(doorLight)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
camera.lookAt(moonLight);

scene.add(camera)
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
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // // Ghosts

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()