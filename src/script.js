// He visto los tutoriales de Bruno Simon y estoy usando su repositorio: https://github.com/brunosimon/my-room-in-3d 
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const loading = document.querySelector('#loader')
const canvas = document.querySelector('canvas.webgl')
const messageC = document.querySelector('.message')
const messageTitle = document.querySelector('.messageTitle')
const messageDescription = document.querySelector('.messageDescription')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    shadowMap: true
})
const globalLight = 'white'
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const textureLoader = new THREE.TextureLoader()
const loader = new GLTFLoader()
let minPan = new THREE.Vector3( -2, -.5, -2 )
let maxPan = new THREE.Vector3( 2, .5, 2 )
let controls, room, robot, sillon, silla, lampara, lamparaBase, jarron01, jarron02, jarron03, book

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
document.body.appendChild(renderer.domElement)

// ====================================
// ====================================
function handleLoadRoom () {
    loader.load('room.glb', (gltf) => {
        room = gltf.scene
        applyTexture(room, 'baked.jpg', .1, .75)
        loading.style.display = 'none'
        scene.add(room)
    })

    document.addEventListener('dblclick', onDocumentMouseClick)
}

function handleLoadModels() {
    const video = document.createElement('video')
    video.src = './video.mp4'
    video.autoplay = true
    video.loop = true
    video.muted = true
    video.setAttribute("crossorigin", "anonymous")

    const videoTexture = new THREE.VideoTexture(video)
    videoTexture.format = THREE.RGBFormat
    videoTexture.minFilter = THREE.NearestFilter
    videoTexture.maxFilter = THREE.NearestFilter
    videoTexture.generateMipmaps = false

    const videoMaterial =  new THREE.MeshStandardMaterial({
        skinning : true,
        map: videoTexture, 
        side: THREE.FrontSide, 
        toneMapped: false
    } )

    loader.load(
        'pantalla.glb',
        (gltf) => {
            gltf.scene.traverse( child => {
                child.material = videoMaterial
                child.material.metalness = .1
                child.material.roughness = .1
            })
            scene.add(gltf.scene)
        }
    )

    loader.load('lampara.glb', (gltf) => {
        lampara = gltf.scene
        applyTexture(lampara, 'baked.jpg', .1, .5)
        lampara.position.sub(new THREE.Vector3(1.25, -1.1, .25))
        scene.add(lampara)
    })

    loader.load('robot.glb', (gltf) => {
        robot = gltf.scene
        applyTexture(robot, 'baked.jpg', 0, 1)
        robot.position.sub(new THREE.Vector3(.25, .42, 1.25))
        scene.add(robot)
    })

    loader.load('sillon.glb', (gltf) => {
        sillon = gltf.scene
        applyTexture(sillon, 'baked.jpg', 0, 1)
        sillon.position.sub(new THREE.Vector3(-1.475, 1.125, -.78))
        scene.add(sillon)
    })

    loader.load('lamparaBase.glb', (gltf) => {
        lamparaBase = gltf.scene
        applyTexture(lamparaBase, 'baked.jpg', 0, 1, true)
        lamparaBase.position.sub(new THREE.Vector3(1.675, .5, 1.25))
        scene.add(lamparaBase)
    })

    loader.load('book.glb', (gltf) => {
        book = gltf.scene
        applyTexture(book, 'baked.jpg', 0, 1)
        book.position.sub(new THREE.Vector3(1.03, 0.53, 1.23))
        scene.add(book)
    })

    loader.load('silla.glb', (gltf) => {
        silla = gltf.scene
        applyTexture(silla, 'baked.jpg', 0, 1)
        silla.position.sub(new THREE.Vector3(.785, .95, 0.225))
        scene.add(silla)
    })

    loader.load('jarron01.glb', (gltf) => {
        jarron01 = gltf.scene
        applyTexture(jarron01, 'baked.jpg', .25, .5)
        jarron01.position.sub(new THREE.Vector3(-.7, -.15, 1.2))
        scene.add(jarron01)
    })

    loader.load('jarron02.glb', (gltf) => {
        jarron02 = gltf.scene
        applyTexture(jarron02, 'baked.jpg', .25, .5)
        jarron02.position.sub(new THREE.Vector3(1.5, -.77, 1.1))
        scene.add(jarron02)
    })

    loader.load('jarron03.glb', (gltf) => {
        jarron03 = gltf.scene
        applyTexture(jarron03, 'baked.jpg', .25, .5)
        jarron03.position.sub(new THREE.Vector3(1.75, -.77, 1.1))
        scene.add(jarron03)
    })

    document.addEventListener('click', onDocumentMouseMove)
}

function handleSetControls () {
    controls = new OrbitControls(camera, renderer.domElement)
    camera.position.x = 18
    camera.position.y = 6
    camera.position.z = 18
    controls.enableDamping = true
    controls.enableZoom = true
    controls.enablePan = true
    controls.minPolarAngle = Math.PI / 5
    controls.maxPolarAngle = Math.PI / 1.9
    controls.minAzimuthAngle = - Math.PI / 10
    controls.maxAzimuthAngle = Math.PI / 1.5
    controls.minDistance = 1
    controls.maxDistance = 16
}

function applyTexture(model, texturePath, metalness, roughness, basic) {
    const texture = textureLoader.load(texturePath)
    let material = basic ? 
        new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }):
        new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide })
    
    texture.flipY = false
    texture.encoding = THREE.sRGBEncoding

    model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.material = material
            child.material.metalness = metalness
            child.material.roughness = roughness
        }
    })
}

function showMessage (message, description) {
    messageTitle.innerText = message
    messageDescription.innerText = description
    messageC.classList.add("is-visible")
}

function onDocumentMouseClick(event) {
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const intersects1 = raycaster.intersectObject(lampara, true)

    if (intersects1.length > 0) {
        if (!lampara.userData.isClicked) {
            lampara.userData.isClicked = true
            showMessage('Ceiling Light', ' This minimalist ceiling light is a perfect choice for your living room, bedroom, kitchen, dining room, office, restaurant, hotel, bar, etc')
            nightMode()
        }
        else{ 
            lampara.userData.isClicked = false
            dayMode()
        }
    } 
}

function onDocumentMouseMove(event) {
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)

    const objectsToIntersect = [
        { object: robot, name: 'Robot', description: 'Crafted from high-quality steel and finished in a painted silver finish, this clock features a large round clockface which takes up the entire body of the robot.' },
        { object: sillon, name: 'Puff Puff', description: 'The design of the Puff Sofa Lite emphasizes its visual appeal while maintaining a soft and comfortable feel.' },
        { object: silla, name: 'Chair', description: 'A modern minimalist chair is a chair that is designed to be as simple as possible. This means that it will have few or no extra features, and it will use materials in their most basic form.' },
        { object: jarron01, name: 'Vase No. 1 - Black Night', description: 'Our Minimal Bud Vases are simple, classy and functional. They are designed for single stem and mini bouquet arrangements.' },
        { object: jarron02, name: 'Vase No. 2 - Golden Aura', description: 'Our Minimal Bud Vases are simple, classy and functional. They are designed for single stem and mini bouquet arrangements.' },
        { object: jarron03, name: 'Vase No. 3 - Silver Vibes', description: 'Our Minimal Bud Vases are simple, classy and functional. They are designed for single stem and mini bouquet arrangements.' },
        { object: book, name: 'Book ?', description: 'Black book, ... right?' },
        { object: lamparaBase, name: 'Lamp', description: 'This beautifully designed color-changing minimalist corner floor lamp fits discreetly and perfectly into corners.' }
    ]

    function handleIntersection(object) {
        const intersects = raycaster.intersectObject(object.object, true)
        if (intersects.length > 0) {
            if (!object.object.userData.isHovered) {
                object.object.userData.isHovered = true
                showMessage(object.name, object.description)
            }
        } else {
            object.object.userData.isHovered = false
        }
    }
    
    objectsToIntersect.forEach(handleIntersection)
}


const lightConfigurations = [
    { intensity: 1, position: new THREE.Vector3(0, 3, 0) },
    { intensity: 0.65, position: new THREE.Vector3(-4, 0, -2) },
    { intensity: 0.65, position: new THREE.Vector3(4, 1, 2) },
    { intensity: 0.5, position: new THREE.Vector3(0, 0, 3) },
    { intensity: 0.65, position: new THREE.Vector3(0, 0, -5) },
    { intensity: 0.5, position: new THREE.Vector3(0, -10, 0) },
];

const lights = []

lightConfigurations.forEach(config => {
    const light = new THREE.DirectionalLight(globalLight, 3)
    scene.add(light)
    light.intensity = config.intensity;
    light.position.copy(config.position)
    light.castShadow = true
    lights.push(light)
});

function handleSetMaterial (path) {
    const objectsToTraverse = [lampara, room, robot, sillon, silla, jarron01, jarron02, jarron03, book, lamparaBase]
    const texture = textureLoader.load(path)
    texture.flipY = false
    // lampara.traverse(child => {if (child instanceof THREE.Mesh) {child.material.map = texture}})
    objectsToTraverse.forEach(object => {
        object.traverse(child => { if (child instanceof THREE.Mesh) { child.material.map = texture }})
    })
}

function handleSetLights (color) {
    for (var i = 0; i < lights.length; i++) {lights[i].color.set(color) }
}

function nightMode(){
    document.body.style.setProperty('--bg','#15293b')
    handleSetLights('#ffffff')
    handleSetMaterial('baked-night.jpg')
}
function dayMode(){
    document.body.style.setProperty('--bg','#f5e4cf')
    handleSetLights('#ffffff')
    handleSetMaterial('baked.jpg')
}

function animate() {
    requestAnimationFrame(animate)
    const objectsToRotate = [robot, sillon, silla, jarron01, jarron02, jarron03, book, lamparaBase]

    objectsToRotate.forEach(object => {
        if (object && object.userData.isHovered) {
            object.rotation.y += 0.03
        }
    })

    controls.update()
    controls.target.clamp( minPan, maxPan )
    renderer.render(scene, camera)
}


window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

messageC.addEventListener('click', () => messageC.classList.remove("is-visible"))

handleLoadModels()
handleLoadRoom()
handleSetControls()
animate()





