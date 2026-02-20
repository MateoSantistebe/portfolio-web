// Windows Manager

const uiLayer = document.getElementById('ui-layer');

function createWindow(id, title, content, x = 100, y = 100, width = 300) {
    // Check if window exists
    const existing = document.querySelector(`.window[data-id="${id}"]`);
    if (existing) {
        bringToFront(existing);
        return;
    }

    const win = document.createElement('div');
    win.className = 'window glitch-in';
    win.setAttribute('data-id', id);
    win.style.left = `${x}px`;
    win.style.top = `${y}px`;
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
    closeBtn.onclick = () => win.remove();

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
    const win = document.querySelector(`.window[data-id="${id}"]`);
    if (win) {
        win.querySelector('.window-title').innerText = title;
        win.querySelector('.window-content').innerHTML = content;
    }
}

function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    handle.onmousedown = dragMouseDown;

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
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
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
