// Initialize Three.js scene
let scene, camera, renderer, particles, particleSystem;

function init() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('scene-container').appendChild(renderer.domElement);
    
    // Create particles
    createParticles();
    
    // Create geometric shapes
    createGeometricShapes();
    
    // Add lighting
    addLighting();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation
    animate();
    
    // Initialize navigation
    initNavigation();
}

function createParticles() {
    // Create particle geometry
    const particleCount = 2000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    // Fill positions with random values
    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Create particle material
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x4cc9f0,
        size: 0.05,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    // Create particle system
    particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);
}

function createGeometricShapes() {
    // Create torus knot
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 32);
    const material = new THREE.MeshPhongMaterial({
        color: 0xf72585,
        shininess: 100,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    
    const torusKnot = new THREE.Mesh(geometry, material);
    torusKnot.position.x = -3;
    torusKnot.position.y = 1;
    scene.add(torusKnot);
    
    // Create icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(1, 0);
    const icoMaterial = new THREE.MeshPhongMaterial({
        color: 0x4361ee,
        wireframe: true,
        transparent: true,
        opacity: 0.7
    });
    
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    icosahedron.position.x = 3;
    icosahedron.position.y = -1;
    scene.add(icosahedron);
    
    // Create octahedron
    const octaGeometry = new THREE.OctahedronGeometry(1, 0);
    const octaMaterial = new THREE.MeshPhongMaterial({
        color: 0x3a0ca3,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    
    const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
    octahedron.position.x = 0;
    octahedron.position.y = 2;
    octahedron.position.z = -2;
    scene.add(octahedron);
}

function addLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    // Directional lights
    const directionalLight1 = new THREE.DirectionalLight(0xf72585, 1);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0x4cc9f0, 1);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);
    
    // Point lights
    const pointLight1 = new THREE.PointLight(0xf72585, 0.5, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x4361ee, 0.5, 100);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particles
    particleSystem.rotation.x += 0.001;
    particleSystem.rotation.y += 0.002;
    
    // Rotate geometric shapes
    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh && child !== particleSystem) {
            child.rotation.x += 0.005;
            child.rotation.y += 0.007;
        }
    });
    
    renderer.render(scene, camera);
}

function initNavigation() {
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }
}

// Initialize the scene when the page loads
window.addEventListener('load', init);

// Add mouse move effect for parallax
document.addEventListener('mousemove', (event) => {
    if (!scene) return;
    
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Move camera slightly based on mouse position for parallax effect
    camera.position.x = mouseX * 0.5;
    camera.position.y = mouseY * 0.5;
    camera.lookAt(scene.position);
});