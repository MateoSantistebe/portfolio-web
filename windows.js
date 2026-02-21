// Windows Manager

const uiLayer = document.getElementById('ui-layer');

function createWindow(id, title, content, x = 100, y = 100, width = 300) {
    // If a window with this ID already exists, append a unique string to allow duplicates
    // This allows the user to open multiple "About", "Contact", etc. windows
    let safeId = id;
    let existing = document.querySelector(`.window[data-id="${safeId}"]`);
    if (existing) {
        safeId = `${id}_${Date.now()}`;
    }

    // Anti-overlap (cascading) logic
    let newX = x;
    let newY = y;

    // --- MOBILE RESPONSIVENESS START: Bounds Constraint ---
    // Ensure the window width doesn't exceed the visual viewport width
    const maxWidth = window.innerWidth - 20; // 20px padding
    if (width > maxWidth) {
        width = maxWidth;
    }

    // Clamp initial positions to ensure the window spawns on screen
    if (newX > window.innerWidth - width) {
        newX = Math.max(10, window.innerWidth - width - 10);
    }
    // Adjust y spawn offset for mobile top bar (around 100px on mobile)
    const topOffset = window.innerWidth < 768 ? 100 : 30;
    if (newY < topOffset) {
        newY = topOffset;
    }
    // --- MOBILE RESPONSIVENESS END ---

    const offsetStep = 30;
    let attempt = 0;

    while (attempt < 20) {
        let isOverlapping = false;
        const existingWindows = document.querySelectorAll('.window');

        for (let i = 0; i < existingWindows.length; i++) {
            const winEl = existingWindows[i];
            const winX = parseInt(winEl.style.left, 10) || 0;
            const winY = parseInt(winEl.style.top, 10) || 0;

            // Check if corners are too close (within 20px)
            if (Math.abs(winX - newX) < 20 && Math.abs(winY - newY) < 20) {
                isOverlapping = true;
                break;
            }
        }

        if (isOverlapping) {
            newX += offsetStep;
            newY += offsetStep;

            // --- MOBILE RESPONSIVENESS START: Clamp retry positions ---
            if (newX > window.innerWidth - width) newX = 10;
            if (newY > window.innerHeight - 300) newY = topOffset;
            // --- MOBILE RESPONSIVENESS END ---
        } else {
            break; // Found clear spot
        }
        attempt++;
    }

    const win = document.createElement('div');
    win.className = 'window glitch-in';
    win.setAttribute('data-id', safeId);
    win.style.left = `${newX}px`;
    win.style.top = `${newY}px`;
    win.style.width = `${width}px`;

    const header = document.createElement('div');
    header.className = 'window-header';

    const titleEl = document.createElement('span');
    titleEl.className = 'window-title';
    titleEl.innerText = title;

    const controls = document.createElement('div');
    controls.className = 'window-controls';

    const minBtn = document.createElement('div');
    minBtn.className = 'control-btn';
    minBtn.innerText = '_';

    const closeBtn = document.createElement('div');
    closeBtn.className = 'control-btn';
    closeBtn.innerText = 'X';

    // --- MOBILE RESPONSIVENESS START: Fix touch interference for close button ---
    closeBtn.onclick = (e) => {
        e.stopPropagation(); // Prevenir que el click se propague al drag handler
        win.remove();
    };
    closeBtn.addEventListener('touchstart', (e) => {
        e.stopPropagation(); // Prevenir que touch lance drag handler
        win.remove();
    }, { passive: false });
    // --- MOBILE RESPONSIVENESS END ---

    controls.appendChild(minBtn);
    controls.appendChild(closeBtn);

    header.appendChild(titleEl);
    header.appendChild(controls);

    const contentEl = document.createElement('div');
    contentEl.className = 'window-content';
    contentEl.innerHTML = content;

    win.appendChild(header);
    win.appendChild(contentEl);

    uiLayer.appendChild(win);

    makeDraggable(win, header);

    return win;
}

function updateWindowContent(id, title, content) {
    // Usamos el ^= (empieza con) para que atrape tanto id="about" como id="about_12345"
    const wins = document.querySelectorAll(`.window[data-id^="${id}"]`);
    wins.forEach(win => {
        const titleEl = win.querySelector('.window-title');
        const contentEl = win.querySelector('.window-content');
        if (titleEl) titleEl.innerText = title;
        if (contentEl) contentEl.innerHTML = content;
    });
}

function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    // Mouse events
    handle.onmousedown = dragMouseDown;

    // --- MOBILE RESPONSIVENESS START: Touch Events ---
    handle.addEventListener('touchstart', dragTouchStart, { passive: false });

    function dragTouchStart(e) {
        // Prevent default scrolling when trying to drag the window header
        e.preventDefault();

        // Use the first touch point
        const touch = e.touches[0];
        pos3 = touch.clientX;
        pos4 = touch.clientY;

        document.addEventListener('touchend', closeDragElement);
        document.addEventListener('touchmove', elementTouchDrag, { passive: false });

        // Bring to front
        bringToFront(element);
    }

    function elementTouchDrag(e) {
        e.preventDefault();
        const touch = e.touches[0];
        pos1 = pos3 - touch.clientX;
        pos2 = pos4 - touch.clientY;
        pos3 = touch.clientX;
        pos4 = touch.clientY;

        let newTop = element.offsetTop - pos2;
        let newLeft = element.offsetLeft - pos1;

        // Optional: Keep window header mostly on screen
        if (newTop < 0) newTop = 0;

        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
    }
    // --- MOBILE RESPONSIVENESS END ---

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        // Bring to front
        bringToFront(element);
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        let newTop = element.offsetTop - pos2;
        let newLeft = element.offsetLeft - pos1;

        // --- MOBILE RESPONSIVENESS START: Keep header on screen ---
        if (newTop < 0) newTop = 0;
        // --- MOBILE RESPONSIVENESS END ---

        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
    }

    function closeDragElement() {
        // Stop moving when mouse or touch is released
        document.onmouseup = null;
        document.onmousemove = null;

        // --- MOBILE RESPONSIVENESS START: Cleanup touch events ---
        document.removeEventListener('touchend', closeDragElement);
        document.removeEventListener('touchmove', elementTouchDrag);
        // --- MOBILE RESPONSIVENESS END ---
    }
}

function bringToFront(element) {
    // Simple z-index handling
    const windows = document.querySelectorAll('.window');
    const navBar = document.getElementById('top-bar');
    let maxZ = 10;

    windows.forEach(win => {
        const z = parseInt(window.getComputedStyle(win).zIndex);
        if (z > maxZ) maxZ = z;
    });

    // Ensure we don't go above the nav bar if it has high z-index (it's 1000)
    if (maxZ >= 999) maxZ = 998;

    element.style.zIndex = maxZ + 1;
}
