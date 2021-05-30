import './style.css'
import * as THREE from 'three'
import { Mesh } from 'three';

/**
 * Base
 */

let camera;
const mouse = new THREE.Vector2();
const mouseRay = new THREE.Vector2()
const target = new THREE.Vector2();
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// // Axes helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

// Texture
const textureLoader = new THREE.TextureLoader()
const textTexture = textureLoader.load('/textures/matcaps/7.png')
const matcapTexture = textureLoader.load('/textures/fontMat.png')
textureLoader.load('/space.jpg', function (texture) {
    scene.background = texture;
});

// Fonts
const fontLoader = new THREE.FontLoader()
fontLoader.load('/fonts/Ubuntu_Bold.json', (font) => {
    const textGeometry = new THREE.TextBufferGeometry(
        "Teng Fone's\nPortfolio\nClick Me!",
        {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 3
        }
    )
    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //     - textGeometry.boundingBox.max.x * 0.5,
    //     - textGeometry.boundingBox.max.y * 0.5,
    //     - textGeometry.boundingBox.max.z * 0.5
    // )
    textGeometry.center()
    const textMaterial = new THREE.MeshMatcapMaterial({ matcap: textTexture })
    const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
    const text = new THREE.Mesh(textGeometry, textMaterial)
    text.name = "3dtext"
    // textMaterial.wireframe = true

    scene.add(text)
})

const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
// Sphere
const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const coneGeometry = new THREE.ConeGeometry(0.2, 0.3, 32);

for (let i = 0; i < 100; i++) {
    const sphere = new THREE.Mesh(sphereGeometry, material);
    const cube = new THREE.Mesh(cubeGeometry, material)
    const cone = new THREE.Mesh(coneGeometry, material)

    // Spread out
    sphere.position.x = (Math.random() - 0.5) * 10
    sphere.position.y = (Math.random() - 0.5) * 10
    sphere.position.z = (Math.random() - 0.5) * 10
    cube.position.x = (Math.random() - 0.5) * 10
    cube.position.y = (Math.random() - 0.5) * 10
    cube.position.z = (Math.random() - 0.5) * 10
    cone.position.x = (Math.random() - 0.5) * 10
    cone.position.y = (Math.random() - 0.5) * 10
    cone.position.z = (Math.random() - 0.5) * 10

    // sphere.rotation.x = Math.random() * Math.PI
    cube.rotation.z = Math.random() * Math.PI
    cone.rotation.x = Math.random() * Math.PI

    const scale = Math.random()
    sphere.scale.set(scale, scale, scale)
    cube.scale.set(scale, scale, scale)
    cone.scale.set(scale, scale, scale)

    // scene.add(sphere);
    scene.add(cube, sphere, cone)
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const windowHalf = new THREE.Vector2(sizes.width / 2, sizes.height / 2);


function onMouseMove(event) {

    mouseRay.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseRay.y = - (event.clientY / window.innerHeight) * 2 + 1;

    mouse.x = (event.clientX - windowHalf.x);
    mouse.y = (event.clientY - windowHalf.y);

}

function onMouseWheel(event) {
    if (camera.position.z >= 7.0) {
        camera.position.z = 7.0
    }
    if (camera.position.z <= -0.5) {
        camera.position.z = -0.5
    }
    camera.position.z += event.deltaY * 0.001; // move camera along z-axis
}

window.addEventListener('click', () => {
    if (currentIntersect) {
        moveToPortfolio = true
    }
})

window.addEventListener('resize', () => {
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
camera = new THREE.PerspectiveCamera(80, sizes.width / sizes.height, 0.1, 100);
document.addEventListener('mousemove', onMouseMove, false);
document.addEventListener('wheel', onMouseWheel, false);
// Base camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -0.3
camera.position.y = 0.2
camera.position.z = 4
scene.add(camera)

// // Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let currentIntersect = null
let moveToPortfolio = null

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // Raycaster to click
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouseRay, camera)
    scene.traverse(function (child) {
        if (child.name === "3dtext") { // THIS <<< DAM OP https://stackoverflow.com/questions/53122208/three-js-get-all-meshes-by-name-property-value
            const intersect = raycaster.intersectObject(child)
            if (intersect.length > 0 && intersect[0].object instanceof Mesh) {
                for (let i = 0; i < intersect.length; i++) {
                    // Mouse Enter
                    currentIntersect = true
                    intersect[i].object.material.transparent = true;
                    intersect[i].object.material.opacity = 0.5
                }
            } else {
                // Mouse Leave
                currentIntersect = null
                child.material.transparent = false
            }
        }
    })

    // Zoom To Portfolio 
    if (moveToPortfolio === true) {
        if (camera.position.z <= -0.5) {
            window.open("https://www.github.com/tengfone")
            camera.position.z = -0.5
            moveToPortfolio = null
            location.reload();
        }
        camera.position.z -= 0.1
    }

    target.x = (1 - mouse.x) * 0.002;
    target.y = (1 - mouse.y) * 0.002;

    camera.rotation.x += 0.05 * (target.y - camera.rotation.x);
    camera.rotation.y += 0.05 * (target.x - camera.rotation.y);

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()