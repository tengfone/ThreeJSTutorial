import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

// Scene
const scene = new THREE.Scene()

// Red Cube
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 'red' })
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)
console.log(mesh.position.distanceTo(camera.position))

// camera.lookAt(mesh.position)

// Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Clock
const clock = new THREE.Clock()

// USE GSAP BETTER
gsap.to(mesh.position, {duration: 1,delay:1, x: 2})
gsap.to(mesh.position, {duration: 1,delay:2, x: 0})

// Animation
const tick = () => {
    // Clock
    const elapsedTime = clock.getElapsedTime()

    // Update Objects
    // mesh.rotation.y = elapsedTime * Math.PI * 2 // 1 Rev per sec
    // mesh.position.y = Math.sin(elapsedTime)
    // mesh.position.x = Math.cos(elapsedTime)

    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()