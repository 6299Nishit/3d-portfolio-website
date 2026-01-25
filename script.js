// Initialize Three.js scene
let scene, camera, renderer, particles, particleSystem;

// Voice Recognition Variables
let recognition;
let isListening = false;
let voiceEnabled = false;
let isProcessingCommand = false; // Prevent duplicate command processing

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
    
    // Initialize voice recognition
    initVoiceRecognition();
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

// Voice Recognition Functions
function initVoiceRecognition() {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.log('Speech recognition not supported in this browser');
        document.getElementById('voice-control').style.display = 'none';
        return;
    }
    
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    // Voice control button event
    const voiceBtn = document.getElementById('voice-btn');
    const voiceStatus = document.getElementById('voice-status');
    
    voiceBtn.addEventListener('click', toggleVoiceControl);
    
    // Modal functionality
    const modal = document.getElementById('voice-modal');
    const closeModal = document.querySelector('.close-modal');
    
    voiceStatus.addEventListener('click', () => {
        modal.style.display = 'block';
    });
    
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Speech recognition events
    recognition.onstart = function() {
        isListening = true;
        voiceBtn.classList.add('listening');
        voiceStatus.textContent = 'Listening... Speak now';
        voiceStatus.style.color = '#4cc9f0';
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[event.resultIndex][0].transcript.toLowerCase();
        voiceStatus.textContent = `You said: ${transcript}`;
        processVoiceCommand(transcript);
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        voiceStatus.textContent = `Error: ${event.error}`;
        voiceStatus.style.color = '#f72585';
        setTimeout(() => {
            if (isListening) {
                voiceStatus.textContent = 'Listening... Speak now';
                voiceStatus.style.color = '#4cc9f0';
            }
        }, 2000);
    };
    
    recognition.onend = function() {
        if (isListening) {
            // Restart recognition if still enabled
            recognition.start();
        } else {
            voiceBtn.classList.remove('listening');
            voiceStatus.textContent = 'Click to start voice control';
            voiceStatus.style.color = '#ffffff';
        }
    };
}

function toggleVoiceControl() {
    if (!recognition) return;
    
    if (isListening) {
        // Stop voice recognition
        isListening = false;
        recognition.stop();
    } else {
        // Start voice recognition
        try {
            recognition.start();
        } catch (e) {
            console.log('Recognition already started');
        }
    }
}

function processVoiceCommand(command) {
    // Prevent duplicate processing
    if (isProcessingCommand) {
        console.log('Command already processing, ignoring:', command);
        return;
    }
    
    isProcessingCommand = true;
    console.log('Processing command:', command);
    
    // Navigation commands
    if (command.includes('home') || command.includes('go to home')) {
        scrollToSection('#home');
        speakResponse('Navigating to home section');
    }
    else if (command.includes('about') || command.includes('tell me about yourself')) {
        scrollToSection('#about');
        speakResponse('Here is my about section');
    }
    else if (command.includes('project') || command.includes('work') || command.includes('my work')) {
        scrollToSection('#projects');
        speakResponse('Showing my featured projects');
    }
    else if (command.includes('contact') || command.includes('get in touch')) {
        scrollToSection('#contact');
        speakResponse('Here is my contact information');
    }
    // Interaction commands
    else if (command.includes('skill') || command.includes('skills')) {
        highlightSkills();
        speakResponse('These are my key technical skills in embedded systems, IoT development, and MATLAB');
    }
    // Satellite project commands
    else if (command.includes('satellite') || command.includes('leo') || command.includes('orbit')) {
        showProjectDetails('satellite');
        speakResponse('This is my LEO MEO satellite optimizer project using genetic algorithms and orbital mechanics');
    }
    else if (command.includes('stopwatch') || command.includes('timer')) {
        showProjectDetails('stopwatch');
        speakResponse('This is my precision digital stopwatch built with Multisim simulation');
    }
    else if (command.includes('pcb') || command.includes('circuit board')) {
        showProjectDetails('pcb');
        speakResponse('This is my custom PCB design project using Eagle and KiCad');
    }
    else if (command.includes('technology') || command.includes('tools')) {
        speakResponse('I work with technologies like MATLAB, embedded C, Arduino, ESP32, and RF hardware components');
    }
    else if (command.includes('send message') || command.includes('contact me')) {
        scrollToSection('#contact');
        speakResponse('You can send me a message using the contact form');
    }
    // Control commands
    else if (command.includes('stop') || command.includes('stop listening')) {
        toggleVoiceControl();
        speakResponse('Voice control stopped');
    }
    else if (command.includes('help') || command.includes('show commands')) {
        document.getElementById('voice-modal').style.display = 'block';
        speakResponse('Showing available voice commands');
    }
    else if (command.includes('close') || command.includes('exit')) {
        toggleVoiceControl();
        speakResponse('Voice control closed');
    }
    else {
        speakResponse('Sorry, I did not understand that command. Say help to see available commands');
    }
    // Note: isProcessingCommand flag is now handled in the speakResponse function
}

function scrollToSection(sectionId) {
    const element = document.querySelector(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function highlightSkills() {
    const skills = document.querySelectorAll('.skill');
    skills.forEach(skill => {
        skill.style.transform = 'scale(1.1)';
        skill.style.boxShadow = '0 0 20px rgba(76, 201, 240, 0.5)';
    });
    
    setTimeout(() => {
        skills.forEach(skill => {
            skill.style.transform = 'scale(1)';
            skill.style.boxShadow = 'none';
        });
    }, 3000);
}

function showProjectDetails(projectId) {
    const projectCard = document.querySelector(`[data-project="${projectId}"]`);
    if (projectCard) {
        projectCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        projectCard.style.transform = 'scale(1.05)';
        projectCard.style.boxShadow = '0 0 30px rgba(247, 37, 133, 0.7)';
        
        setTimeout(() => {
            projectCard.style.transform = 'scale(1)';
            projectCard.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        }, 3000);
    }
}

function speakResponse(text) {
    // Check if browser supports speech synthesis
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech to prevent duplicates
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Set the processing flag to false when speech ends
        utterance.onend = function() {
            setTimeout(() => {
                isProcessingCommand = false;
            }, 100); // Small delay to ensure speech fully completes
        };
        
        // Handle error case as well
        utterance.onerror = function() {
            setTimeout(() => {
                isProcessingCommand = false;
            }, 100);
        };
        
        speechSynthesis.speak(utterance);
    } else {
        // If speech synthesis is not supported, just reset the flag
        setTimeout(() => {
            isProcessingCommand = false;
        }, 100);
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