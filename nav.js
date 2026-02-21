// Navigation Logic

document.addEventListener('DOMContentLoaded', () => {
    let currentLang = 'EN';

    // Helper for binary data generation
    function getBinaryData() {
        return Array(20).fill(0).map(() => {
            return Math.random().toString(2).substr(2, 8).padEnd(8, '0');
        }).join(' ');
    }
    const binaryData = getBinaryData();

    // Helper to open project files
    // Helper to open project files
    window.openProjectWindow = function (type, src, title) {
        let content = '';
        const uniqueId = 'media_' + Date.now();

        let width = 400; // Default width

        if (type === 'video') {
            width = 400; // Adjusted width based on user feedback (smaller but full aspect)
            content = `
                <video controls style="width: 100%; height: auto; border: 1px solid #333; display: block;">
                    <source src="${src}" type="video/mp4">
                    YOUR BROWSER DOES NOT SUPPORT THE VIDEO TAG.
                </video>
            `;
        } else if (type === 'audio') {
            width = 500;
            // --- MOBILE RESPONSIVENESS START: Dynamic canvas width ---
            const canvasWidth = Math.min(460, window.innerWidth - 60);
            content = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #fff;">
                    <canvas id="canvas_${uniqueId}" width="${canvasWidth}" height="100" style="border-bottom: 1px solid #333; margin-bottom: 20px; max-width: 100%;"></canvas>
                    <div style="font-family: monospace; margin-bottom: 10px; color: #000; font-size: 0.8em; text-align: center;">[ AUDIO_WAVEFORM_VISUALIZER ]</div>
                    <audio id="audio_${uniqueId}" controls style="width: 90%; margin-bottom: 20px;" crossorigin="anonymous">
                        <source src="${src}" type="audio/wav">
                        YOUR BROWSER DOES NOT SUPPORT THE AUDIO TAG.
                    </audio>
                </div>
            `;
            // --- MOBILE RESPONSIVENESS END ---
        } else if (type === 'gallery') {
            width = 350;
            content = `
                <div style="display: flex; flex-direction: column; gap: 10px; padding: 10px;">
                    <img src="${src}/1.jpg" style="width: 100%; border: 1px solid #333;" alt="Gallery Image 1">
                    <img src="${src}/2.jpg" style="width: 100%; border: 1px solid #333;" alt="Gallery Image 2">
                    <img src="${src}/3.jpg" style="width: 100%; border: 1px solid #333;" alt="Gallery Image 3">
                </div>
            `;
        }

        // Fixed position for media players (Center-Left focus)
        const x = 200;
        const y = 100;

        // Create window and get reference (windows.js must return the created element)
        const win = createWindow('project_view_' + Date.now(), title, content, x, y, width);

        // Apply specific styles for media windows to ensure they fit content (no scroll)
        if (win && type !== 'gallery') {
            const contentEl = win.querySelector('.window-content');
            if (contentEl) {
                contentEl.style.maxHeight = 'none';
                contentEl.style.overflow = 'hidden';
            }
        } else if (win && type === 'gallery') {
            // For gallery, explicitly set a taller max-height if desired, but keep it scrollable
            const contentEl = win.querySelector('.window-content');
            if (contentEl) {
                contentEl.style.maxHeight = '400px';
                contentEl.style.overflowY = 'auto';
            }
        }

        // Initialize Audio Visualizer if type is audio
        if (type === 'audio' && win) {
            setTimeout(() => {
                const audio = document.getElementById(`audio_${uniqueId}`);
                const canvas = document.getElementById(`canvas_${uniqueId}`);
                if (audio && canvas) {
                    const ctx = canvas.getContext('2d');
                    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    const analyser = audioCtx.createAnalyser();
                    const source = audioCtx.createMediaElementSource(audio);

                    source.connect(analyser);
                    analyser.connect(audioCtx.destination);

                    analyser.fftSize = 2048;
                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);

                    function draw() {
                        requestAnimationFrame(draw);

                        analyser.getByteTimeDomainData(dataArray);

                        ctx.fillStyle = 'rgb(255, 255, 255)'; // White background
                        ctx.fillRect(0, 0, canvas.width, canvas.height);

                        ctx.lineWidth = 2;
                        ctx.strokeStyle = '#000000'; // Black line for cybercore look

                        ctx.beginPath();

                        const sliceWidth = canvas.width * 1.0 / bufferLength;
                        let x = 0;

                        for (let i = 0; i < bufferLength; i++) {
                            const v = dataArray[i] / 128.0;
                            const y = v * canvas.height / 2;

                            if (i === 0) {
                                ctx.moveTo(x, y);
                            } else {
                                ctx.lineTo(x, y);
                            }

                            x += sliceWidth;
                        }

                        ctx.lineTo(canvas.width, canvas.height / 2);
                        ctx.stroke();
                    }

                    // Resume AudioContext on play (browser policy)
                    audio.addEventListener('play', () => {
                        if (audioCtx.state === 'suspended') {
                            audioCtx.resume();
                        }
                    });

                    draw();
                }
            }, 100);
        }
    };

    const translations = {
        'EN': {
            'nav': {
                'about': 'ABOUT',
                'projects': 'PROJECTS',
                'contact': 'CONTACT',
                'online': 'ONLINE',
                'secure': 'SECURE',
                'audio': 'AUDIO',
                'on': 'ON',
                'off': 'OFF'
            },
            'content': {
                'about': {
                    'title': 'ABOUT',
                    'html': `
                        <h3>// PROFESSIONAL_PROFILE</h3>
                        <p>I am a detail-oriented, creative, and organized professional, driven by experimentation and innovation in the audiovisual field.</p>
                        <br>
                        <p><strong>// CORE_STRENGTH: AI & MULTIMEDIA ART</strong></p>
                        <p>I combine a solid technical foundation with a creative vision for content generation, specializing in:</p>
                        <ul>
                            <li>Usage of advanced environments like <strong>ComfyUI</strong> for image and video creation.</li>
                            <li>Experimentation with specialized platforms like <strong>HiggsfieldAI</strong>.</li>
                        </ul>
                        <br>
                        <p><strong>// SECONDARY_SPECIALIZATION: SOUND_DESIGN</strong></p>
                        <p>Focus on technical and expressive sound manipulation to build immersive narratives:</p>
                        <ul>
                            <li><strong>Composition & Editing:</strong> Creation of soundscapes, textures, ambiances, and Foley with professional DAWs (Reaper, Ableton Live).</li>
                            <li><strong>AI Audio:</strong> Production and manipulation of audio using synthesis and sound generation models.</li>
                        </ul>
                        <br>
                        <p>> "My goal is to use these advanced technologies to enhance narrative and sensory experience, ensuring coherence, rhythm, and sensitivity in the final result."</p>
                    `
                },
                'projects': {
                    'title': 'PROJECTS',
                    'html': `
                        <h3>// PROJECT_INDEX</h3>
                        <div class="project-item">
                            <strong>[001] "Prefrontal Leucotomy"</strong><br>
                            <span style="font-size: 0.9em; opacity: 0.7;">> AI / UNA DIPLOMA INTEGRATOR</span>
                            <p style="margin-top: 5px; font-size: 0.9em;">Exploration of AI in creative processes.</p>
                            <a href="#" onclick="openProjectWindow('video', 'projects/leucomotmia-prefrontal/Proyecto-Integrador-Final-Edit_1.mp4', 'PREFRONTAL_LEUCOTOMY'); return false;">[ OPEN_FILE ]</a>
                        </div>
                        <br>
                        <div class="project-item">
                            <strong>[002] "Video Game Sound Montage"</strong><br>
                            <span style="font-size: 0.9em; opacity: 0.7;">> SOUND DESIGN</span>
                            <p style="margin-top: 5px; font-size: 0.9em;">Creation of experimental soundscapes, textures, and rhythms using processed digital material.</p>
                            <a href="#" onclick="openProjectWindow('audio', 'projects/sonomontaje-videojuego/sonomontaje-videojuego.mp3', 'GAME_SOUND_MONTAGE'); return false;">[ OPEN_FILE ]</a>
                        </div>
                        <br>
                        <div class="project-item">
                            <strong>[003] "Poetic Sound Montage"</strong><br>
                            <span style="font-size: 0.9em; opacity: 0.7;">> SOUND DESIGN</span>
                            <p style="margin-top: 5px; font-size: 0.9em;">Atmospheric composition based on the interaction between word, rhythm, and silence.</p>
                            <a href="#" onclick="openProjectWindow('audio', 'projects/sonomontaje-poetico/sonomontaje-poetico.mp3', 'POETIC_SOUND_MONTAGE'); return false;">[ OPEN_FILE ]</a>
                        </div>
                        <br>
                        <div class="project-item">
                            <strong>[004] "Cyborg Girls"</strong><br>
                            <span style="font-size: 0.9em; opacity: 0.7;">> AI / IMAGE GENERATION</span>
                            <p style="margin-top: 5px; font-size: 0.9em;">Exploration of cybernetic aesthetics through AI models.</p>
                            <a href="#" onclick="openProjectWindow('gallery', 'projects/ciborggirls', 'CYBORG_GIRLS'); return false;">[ OPEN_FILE ]</a>
                        </div>
                    `
                },
                'contact': {
                    'title': 'CONTACT',
                    'html': `
                        <h3>// TRANSMISSION_LINK</h3>
                        <p>ESTABLISH CONNECTION:</p>
                        <br>
                        <p>> EMAIL: <a href="mailto:mateosantistebe@gmail.com">mateosantistebe@gmail.com</a></p>
                        <p>> GITHUB: <a href="https://github.com/MateoSantistebe" target="_blank">@MateoSantistebe</a></p>
                        <p>> LINKEDIN: <a href="https://www.linkedin.com/in/mateo-santistebe-41bb79228/" target="_blank">@mateo-santistebe</a></p>
                        <p>> INSTAGRAM: <a href="https://www.instagram.com/mateo_santistebe/" target="_blank">@mateo_santistebe</a></p>
                        <br>
                        <p>STATUS: ACCEPTING NEW CONTRACTS</p>
                    `
                },
                'system_data': {
                    'title': 'SYSTEM_DATA',
                    'html': `
                        <div style="font-family: monospace; line-height: 1.4;">
                            <img src="gifs_index/39516a1b9870f5be48d05a706d986185.gif" style="width: 100%; margin-bottom: 10px; border: 1px solid #000;">
                            ${binaryData}
                            <br><br>
                            STATUS: ONLINE<br>
                            CORE: STABLE<br>
                            INTERPOLATION: 99.8%
                        </div>
                    `
                },
                'terminal': {
                    'title': 'TERMINAL',
                    'html': `
                        <img src="gifs_index/69a81bcc704273f317a060ae99f509e4.gif" style="width: 100%; margin-bottom: 10px; opacity: 0.8;">
                        > connect 192.168.0.1<br>
                        > establishing secure connection...<br>
                        > handshake complete.<br>
                        > access granted.<br>
                        > _
                    `
                },
                'visualizers': {
                    'title': 'VISUALIZERS',
                    'html': `
                        <div style="display: grid; gap: 10px;">
                            <img src="gifs_index/50928e31ec18ee575989c2476a16f6dd.gif" style="width: 100%; border: 1px solid #000;">
                            <img src="gifs_index/5f09f7d6653e80ad261bac19c1ce53dc.gif" style="width: 100%; border: 1px solid #000;">
                            <img src="gifs_index/838c03728056fdaf9ee778ba1cd6f85a.gif" style="width: 100%; border: 1px solid #000;">
                        </div>
                        <br>
                        LOADING ASSETS...<br>
                        [||||||||||] 100%
                    `
                }
            }
        },
        'ES': {
            'nav': {
                'about': 'SOBRE MI',
                'projects': 'PROYECTOS',
                'contact': 'CONTACTO',
                'online': 'EN LINEA',
                'secure': 'SEGURO',
                'audio': 'AUDIO',
                'on': 'ACT',
                'off': 'DES'
            },
            'content': {
                'about': {
                    'title': 'SOBRE MI',
                    'html': `
                        <h3>// PERFIL_PROFESIONAL</h3>
                        <p>Soy un profesional detallista, creativo y organizado, impulsado por la experimentación y la innovación en el campo audiovisual.</p>
                        <br>
                        <p><strong>// FORTALEZA_PRINCIPAL: IA & ARTE MULTIMEDIAL</strong></p>
                        <p>Combino una sólida base técnica con una visión creativa para la generación de contenido, especializándome en:</p>
                        <ul>
                            <li>Uso de entornos avanzados como <strong>ComfyUI</strong> para la creación de imágenes y videos.</li>
                            <li>Experimentación con plataformas especializadas como <strong>HiggsfieldAI</strong>.</li>
                        </ul>
                        <br>
                        <p><strong>// ESPECIALIZACION_SECUNDARIA: DISENO_SONORO</strong></p>
                        <p>Me enfoco en la manipulación técnica y expresiva del sonido para construir narrativas inmersivas:</p>
                        <ul>
                            <li><strong>Composición y Montaje:</strong> Creación de paisajes sonoros, texturas, ambientes y efectos (Foley) con DAWs profesionales (Reaper y Ableton Live).</li>
                            <li><strong>Audio con IA:</strong> Producción y manipulación de audio mediante modelos de síntesis y generación sonora.</li>
                        </ul>
                        <br>
                        <p>> "Mi objetivo es utilizar estas tecnologías avanzadas para potenciar la narrativa y la experiencia sensorial en cada proyecto, asegurando siempre coherencia, ritmo y sensibilidad en el resultado final."</p>
                    `
                },
                'projects': {
                    'title': 'PROYECTOS',
                    'html': `
                        <h3>// INDICE_PROYECTOS</h3>
                        <div class="project-item">
                            <strong>[001] "Leucotomía Prefrontal"</strong><br>
                            <span style="font-size: 0.9em; opacity: 0.7;">> IA / PROYECTO INTEGRADOR UNA</span>
                            <p style="margin-top: 5px; font-size: 0.9em;">Exploración de IA en procesos creativos.</p>
                            <a href="#" onclick="openProjectWindow('video', 'projects/leucomotmia-prefrontal/Proyecto-Integrador-Final-Edit_1.mp4', 'LEUCOTOMIA_PREFRONTAL'); return false;">[ ABRIR_ARCHIVO ]</a>
                        </div>
                        <br>
                        <div class="project-item">
                            <strong>[002] "Sonomontaje videojuego"</strong><br>
                            <span style="font-size: 0.9em; opacity: 0.7;">> DISEÑO SONORO</span>
                            <p style="margin-top: 5px; font-size: 0.9em;">Creación y montaje de paisajes sonoros experimentales. Diseño de texturas, planos y ritmos.</p>
                            <a href="#" onclick="openProjectWindow('audio', 'projects/sonomontaje-videojuego/sonomontaje-videojuego.mp3', 'SONOMONTAJE_VIDEOJUEGO'); return false;">[ ABRIR_ARCHIVO ]</a>
                        </div>
                        <br>
                        <div class="project-item">
                            <strong>[003] "Sonomontaje poético"</strong><br>
                            <span style="font-size: 0.9em; opacity: 0.7;">> DISEÑO SONORO</span>
                            <p style="margin-top: 5px; font-size: 0.9em;">Composición sonora basada en la interacción entre palabra, ritmo y silencio.</p>
                            <a href="#" onclick="openProjectWindow('audio', 'projects/sonomontaje-poetico/sonomontaje-poetico.mp3', 'SONOMONTAJE_POETICO'); return false;">[ ABRIR_ARCHIVO ]</a>
                        </div>
                        <br>
                        <div class="project-item">
                            <strong>[004] "Cyborg Girls"</strong><br>
                            <span style="font-size: 0.9em; opacity: 0.7;">> IA / GENERACIÓN DE IMÁGENES</span>
                            <p style="margin-top: 5px; font-size: 0.9em;">Exploración de estéticas cibernéticas usando modelos de IA.</p>
                            <a href="#" onclick="openProjectWindow('gallery', 'projects/ciborggirls', 'CHICAS_CYBORG'); return false;">[ ABRIR_ARCHIVO ]</a>
                        </div>
                    `
                },
                'contact': {
                    'title': 'CONTACTO',
                    'html': `
                        <h3>// ENLACE_TRANSMISION</h3>
                        <p>ESTABLECER CONEXION:</p>
                        <br>
                        <p>> EMAIL: <a href="mailto:mateosantistebe@gmail.com">mateosantistebe@gmail.com</a></p>
                        <p>> GITHUB: <a href="https://github.com/MateoSantistebe" target="_blank">@MateoSantistebe</a></p>
                        <p>> LINKEDIN: <a href="https://www.linkedin.com/in/mateo-santistebe-41bb79228/" target="_blank">@mateo-santistebe</a></p>
                        <p>> INSTAGRAM: <a href="https://www.instagram.com/mateo_santistebe/" target="_blank">@mateo_santistebe</a></p>
                        <br>
                        <p>ESTADO: ACEPTANDO NUEVOS CONTRATOS</p>
                    `
                },
                'system_data': {
                    'title': 'DATOS_SISTEMA',
                    'html': `
                        <div style="font-family: monospace; line-height: 1.4;">
                            <img src="gifs_index/39516a1b9870f5be48d05a706d986185.gif" style="width: 100%; margin-bottom: 10px; border: 1px solid #000;">
                            ${binaryData}
                            <br><br>
                            ESTADO: EN LINEA<br>
                            NUCLEO: ESTABLE<br>
                            INTERPOLACION: 99.8%
                        </div>
                    `
                },
                'terminal': {
                    'title': 'TERMINAL',
                    'html': `
                        <img src="gifs_index/69a81bcc704273f317a060ae99f509e4.gif" style="width: 100%; margin-bottom: 10px; opacity: 0.8;">
                        > conectar 192.168.0.1<br>
                        > estableciendo conexion segura...<br>
                        > handshake completo.<br>
                        > acceso concedido.<br>
                        > _
                    `
                },
                'visualizers': {
                    'title': 'VISUALIZADORES',
                    'html': `
                        <div style="display: grid; gap: 10px;">
                            <img src="gifs_index/50928e31ec18ee575989c2476a16f6dd.gif" style="width: 100%; border: 1px solid #000;">
                            <img src="gifs_index/5f09f7d6653e80ad261bac19c1ce53dc.gif" style="width: 100%; border: 1px solid #000;">
                            <img src="gifs_index/838c03728056fdaf9ee778ba1cd6f85a.gif" style="width: 100%; border: 1px solid #000;">
                        </div>
                        <br>
                        CARGANDO ASSETS...<br>
                        [||||||||||] 100%
                    `
                }
            }
        }
    };

    let isAudioPlaying = false;
    const bgMusic = document.getElementById('bg-music');

    function updateLanguage() {
        const t = translations[currentLang];

        // Update Nav
        const aboutLink = document.querySelector('[data-section="about"]');
        if (aboutLink) aboutLink.innerText = t.nav.about;

        const projectsLink = document.querySelector('[data-section="projects"]');
        if (projectsLink) projectsLink.innerText = t.nav.projects;

        const contactLink = document.querySelector('[data-section="contact"]');
        if (contactLink) contactLink.innerText = t.nav.contact;

        // Update Status
        const statusSpans = document.querySelectorAll('.status-info span:not(#lang-toggle):not(#audio-toggle)');
        if (statusSpans.length >= 2) {
            statusSpans[0].innerText = t.nav.online;
            statusSpans[1].innerText = t.nav.secure;
        }

        // Update Audio Toggle Text
        const audioBtn = document.getElementById('audio-toggle');
        if (audioBtn) {
            const stateText = isAudioPlaying ? t.nav.on : t.nav.off;
            audioBtn.innerText = `[ ${t.nav.audio}: ${stateText} ]`;
        }

        // Update Toggle Button Text
        const langBtn = document.getElementById('lang-toggle');
        if (langBtn) langBtn.innerText = `[ ${currentLang} ]`;

        // Update ALL active windows
        Object.keys(t.content).forEach(key => {
            const data = t.content[key];
            updateWindowContent(key, data.title, data.html); // Function from windows.js
        });
    }

    // Handle clicks
    const windowPositions = {
        'about': { x: 350, y: 50 },
        'projects': { x: 800, y: 80 },
        'contact': { x: 450, y: 500 }
    };

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const section = e.target.getAttribute('data-section');
            if (section) {
                const data = translations[currentLang].content[section];

                // Use fixed position if available, otherwise default/random
                let pos = windowPositions[section] || { x: 100, y: 100 };

                // --- MOBILE RESPONSIVENESS START: Adjust spawn for mobile screens ---
                if (window.innerWidth < 768) {
                    pos = { x: 10, y: 80 }; // Spawn centrally on mobile
                }
                // --- MOBILE RESPONSIVENESS END ---

                createWindow(section, data.title, data.html, pos.x, pos.y, 400);
            }
        });
    });

    // Language Toggle Listener
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'EN' ? 'ES' : 'EN';
            updateLanguage();
        });
    }

    // Audio Toggle Listener
    const audioToggle = document.getElementById('audio-toggle');
    if (audioToggle) {
        audioToggle.addEventListener('click', () => {
            if (bgMusic) {
                if (isAudioPlaying) {
                    bgMusic.pause();
                    isAudioPlaying = false;
                } else {
                    bgMusic.volume = 0.3; // Default volume
                    bgMusic.play().catch(e => console.log("Audio play prevented:", e));
                    isAudioPlaying = true;
                }
                updateLanguage(); // Update button text
            }
        });
    }

    // Initialize System Windows
    setTimeout(() => {
        // const t = translations[currentLang];
        // createWindow('system_data', t.content.system_data.title, t.content.system_data.html, 50, 50, 250);
        // createWindow('terminal', t.content.terminal.title, t.content.terminal.html, 400, 150, 350);
        // createWindow('visualizers', t.content.visualizers.title, t.content.visualizers.html, 100, 400, 200);
    }, 100);



    // Initialize Language
    updateLanguage();

    // Update time in status info
    setInterval(() => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: false });
        // update if we had an element for it, maybe adding it later
    }, 1000);
});
