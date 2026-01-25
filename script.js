// Initialize Three.js scene
let scene, camera, renderer, particles, particleSystem;

// Voice Recognition and Synthesis Variables
let recognition;
let isListening = false;
let isProcessingCommand = false;

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

// Initialize voice recognition
function initVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = function(event) {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            const spokenText = finalTranscript.trim().toLowerCase();

            if (spokenText) {
                document.getElementById('voice-status').textContent = `Heard: ${spokenText}`;
                
                if (!isProcessingCommand) {
                    processVoiceCommand(spokenText);
                }
            }
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            document.getElementById('voice-status').textContent = `Error: ${event.error}`;
            setTimeout(() => {
                if (isListening) {
                    startListening();
                }
            }, 1000);
        };

        recognition.onend = function() {
            if (isListening) {
                // Restart recognition if it ended unexpectedly
                setTimeout(() => {
                    if (isListening && !recognition.listening) {
                        startListening();
                    }
                }, 100);
            }
        };

        // Set up event listeners for voice control button and modal
        document.getElementById('voice-btn').addEventListener('click', toggleVoiceControl);
        document.querySelector('.close-modal').addEventListener('click', closeVoiceModal);
        document.getElementById('voice-status').addEventListener('click', showVoiceCommands);

        // Close modal when clicking outside
        document.addEventListener('click', function(e) {
            const modal = document.getElementById('voice-modal');
            if (e.target === modal) {
                closeVoiceModal();
            }
        });
    } else {
        console.warn('Speech recognition not supported in this browser.');
        document.getElementById('voice-status').textContent = 'Voice control not supported';
        document.getElementById('voice-btn').disabled = true;
    }
}

// Toggle voice control on/off
function toggleVoiceControl() {
    if (isListening) {
        stopListening();
    } else {
        startListening();
    }
}

// Start voice recognition
function startListening() {
    if (recognition && !isListening) {
        recognition.start();
        isListening = true;
        const voiceBtn = document.getElementById('voice-btn');
        voiceBtn.classList.add('listening');
        voiceBtn.innerHTML = '<span class="mic-icon">🔴</span><span class="btn-text">Listening...</span>';
        document.getElementById('voice-status').textContent = 'Listening... Speak now.';
    }
}

// Stop voice recognition
function stopListening() {
    if (recognition && isListening) {
        recognition.stop();
        isListening = false;
        const voiceBtn = document.getElementById('voice-btn');
        voiceBtn.classList.remove('listening');
        voiceBtn.innerHTML = '<span class="mic-icon">🎤</span><span class="btn-text">Voice Control</span>';
        document.getElementById('voice-status').textContent = 'Voice control stopped';
    }
}

// Process voice commands
function processVoiceCommand(command) {
    if (isProcessingCommand) return; // Prevent duplicate processing
    
    isProcessingCommand = true;
    document.getElementById('voice-status').textContent = `Processing: ${command}`;

    // Navigation commands
    if (command.includes('home') || command.includes('go to home') || command.includes('home page')) {
        navigateToSection('home');
        speakResponse("Navigating to home section.");
    } 
    else if (command.includes('about') || command.includes('about me') || command.includes('tell me about yourself')) {
        navigateToSection('about');
        speakResponse("Showing about section.");
    } 
    else if (command.includes('project') || command.includes('show projects') || command.includes('my work') || command.includes('satellite') || command.includes('leo project') || command.includes('satellite optimizer')) {
        navigateToSection('projects');
        speakResponse("Showing projects section. The LEO/MEO Satellite Optimizer project uses genetic algorithms for constellation optimization.");
    } 
    else if (command.includes('contact') || command.includes('get in touch') || command.includes('contact information') || command.includes('send message')) {
        navigateToSection('contact');
        speakResponse("Showing contact section.");
    }
    // Project-specific commands
    else if (command.includes('satellite project') || command.includes('satellite optimizer') || command.includes('orbital mechanics') || command.includes('space project') || command.includes('genetic algorithm') || command.includes('optimization')) {
        navigateToSection('projects');
        speakResponse("The LEO/MEO Satellite Optimizer project uses genetic algorithms to optimize satellite constellation designs for Low Earth Orbit and Medium Earth Orbit missions. It includes trajectory calculations, coverage analysis, and ground station optimization using MATLAB toolboxes and RF hardware.");
        highlightProject('satellite');
    }
    else if (command.includes('pcb design') || command.includes('pcb') || command.includes('printed circuit board')) {
        navigateToSection('projects');
        speakResponse("The PCB Design project showcases expertise in circuit design and layout using industry-standard tools.");
        highlightProject('pcb');
    }
    else if (command.includes('stopwatch') || command.includes('timer') || command.includes('clock')) {
        navigateToSection('projects');
        speakResponse("The Stopwatch project is a responsive web application with timing functionality.");
        highlightProject('stopwatch');
    }
    // Skills and technology commands
    else if (command.includes('skills') || command.includes('technologies') || command.includes('what technologies do you use')) {
        navigateToSection('about');
        speakResponse("Skills include JavaScript, Python, React, Node.js, Three.js, and various other technologies.");
    }
    // Help commands
    else if (command.includes('help') || command.includes('commands') || command.includes('show commands')) {
        showVoiceCommands();
        speakResponse("Displaying available voice commands.");
    }
    // Stop commands
    else if (command.includes('stop listening') || command.includes('close voice control')) {
        stopListening();
        speakResponse("Voice control stopped.");
    }
    // Unrecognized command
    else {
        speakResponse(`I didn't understand "${command}". Say "help" to hear available commands.`);
    }
}

// Speak response using Web Speech API
function speakResponse(text) {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech to prevent overlap
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Reset processing flag when speech ends
        utterance.onend = function() {
            isProcessingCommand = false;
            document.getElementById('voice-status').textContent = 'Ready for command';
        };
        
        utterance.onerror = function() {
            isProcessingCommand = false;
            document.getElementById('voice-status').textContent = 'Ready for command';
        };
        
        // Fallback to reset processing flag if events don't fire properly
        setTimeout(() => {
            if (isProcessingCommand) {
                isProcessingCommand = false;
                document.getElementById('voice-status').textContent = 'Ready for command';
            }
        }, 3000); // 3 second timeout as fallback
        
        window.speechSynthesis.speak(utterance);
    } else {
        console.warn('Speech synthesis not supported in this browser.');
        isProcessingCommand = false;
        document.getElementById('voice-status').textContent = 'Speech not supported';
    }
}

// Navigate to a section
function navigateToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Highlight a specific project
function highlightProject(projectName) {
    // Remove highlight from all projects
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.boxShadow = 'none';
        card.style.transform = 'scale(1)';
    });
    
    // Add highlight to specific project
    const projectCard = document.querySelector(`[data-project="${projectName}"]`);
    if (projectCard) {
        projectCard.style.boxShadow = '0 0 30px rgba(76, 201, 240, 0.8)';
        projectCard.style.transform = 'scale(1.03)';
        
        // Reset after delay
        setTimeout(() => {
            if (projectCard) {
                projectCard.style.boxShadow = 'none';
                projectCard.style.transform = 'scale(1)';
            }
        }, 2000);
    }
}

// Show voice commands modal
function showVoiceCommands() {
    document.getElementById('voice-modal').style.display = 'block';
}

// Close voice commands modal
function closeVoiceModal() {
    document.getElementById('voice-modal').style.display = 'none';
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