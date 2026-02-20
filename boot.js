// Boot Sequence Logic
document.addEventListener('DOMContentLoaded', () => {
    const bootScreen = document.getElementById('boot-screen');
    const lines = [
        "MATEO_OS v1.0 [Version 10.0.19045.2486]",
        "(c) MATEO Corporation. All rights reserved.",
        "",
        "BIOS Date 02/20/26 18:45:00 Ver 08.00.10",
        "CPU: Neural Processing Unit - 4.20 GHz",
        "Memory Test: 645120K OK",
        "",
        "Initializing kernel...",
        "Loading modules.......... DONE",
        "Mounting file systems...... OK",
        "Starting visual interface...",
        "Establishing neural link... CONNECTED",
        "Access granted. Welcome."
    ];

    let currentLineIndex = 0;

    function typeLine() {
        if (currentLineIndex < lines.length) {
            const lineEl = document.createElement('div');
            lineEl.className = 'boot-line';
            lineEl.innerText = lines[currentLineIndex];
            bootScreen.appendChild(lineEl);

            // Add cursor to last line
            const cursor = document.createElement('span');
            cursor.className = 'boot-cursor';
            lineEl.appendChild(cursor);

            // Remove cursor from previous line
            if (currentLineIndex > 0) {
                const prevLine = bootScreen.children[currentLineIndex - 1];
                const prevCursor = prevLine.querySelector('.boot-cursor');
                if (prevCursor) prevCursor.remove();
            }

            currentLineIndex++;

            // Random delay between 100ms and 400ms per line to simulate real loading
            const delay = Math.random() * 300 + 100;

            // Make the last few lines a bit slower
            if (currentLineIndex > lines.length - 3) {
                setTimeout(typeLine, delay + 400);
            } else {
                setTimeout(typeLine, delay);
            }
        } else {
            // Sequence finished. Fade out screen and show UI.
            setTimeout(() => {
                bootScreen.style.opacity = '0';
                document.body.classList.remove('booting');

                setTimeout(() => {
                    bootScreen.style.display = 'none';
                }, 500); // Wait for transition out
            }, 800);
        }
    }

    // Start sequence
    setTimeout(typeLine, 500);
});
