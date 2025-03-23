// Check if the script has already been injected
if (window.selectionScriptInjected) {
    console.warn("Selection script already injected.");
} else {
    window.selectionScriptInjected = true;

    (function() {
        // Inject CSS styles programmatically
        const style = document.createElement('style');
        style.textContent = `
            #selection {
                position: fixed;
                border: 2px solid #0c65a5;
                background-color: rgba(12, 101, 165, 0.15);
                pointer-events: none;
                z-index: 999999;
                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
                display: none;
                mix-blend-mode: multiply;
            }

            #selection.active {
                display: block !important;
            }

            #selection.complete {
                border-style: solid;
                border-color: #0CA50E;
                background-color: rgba(12, 165, 14, 0.15);
            }

            body.selecting {
                user-select: none !important;
                cursor: crosshair !important; /* Ensure cursor visibility */
            }
        `;
        document.head.appendChild(style);

        let selectionDiv = document.getElementById('selection');
        if (!selectionDiv) {
            selectionDiv = document.createElement('div');
            selectionDiv.id = 'selection';
            document.body.appendChild(selectionDiv);
        }

        let previewDiv = document.getElementById('selection-preview');
        if (!previewDiv) {
            previewDiv = document.createElement('div');
            previewDiv.id = 'selection-preview';
            document.body.appendChild(previewDiv);
        }

        let isSelecting = false;
        let start = { x: 0, y: 0 };
        let end = { x: 0, y: 0 };

        function updateSelection(e) {
            if (!isSelecting) return;

            end.x = e.pageX;
            end.y = e.pageY;

            const left = Math.min(start.x, end.x);
            const top = Math.min(start.y, end.y);
            const width = Math.abs(start.x - end.x);
            const height = Math.abs(start.y - end.y);

            selectionDiv.style.left = `${left}px`;
            selectionDiv.style.top = `${top}px`;
            selectionDiv.style.width = `${width}px`;
            selectionDiv.style.height = `${height}px`;
        }

        function startSelection(e) {
            if (e.button !== 0) return;

            isSelecting = true;
            previewDiv.style.display = 'none';

            start.x = e.pageX;
            start.y = e.pageY;

            selectionDiv.classList.remove('complete');
            selectionDiv.classList.add('active');
            selectionDiv.style.display = 'block';

            document.body.classList.add('selecting'); // Add selecting class

            updateSelection(e);
        }

        function endSelection(e) {
            if (!isSelecting) return;

            isSelecting = false;
            previewDiv.style.display = 'block';

            const width = Math.abs(start.x - end.x);
            const height = Math.abs(start.y - end.y);

            if (width > 5 && height > 5) {
                selectionDiv.classList.add('complete');
                chrome.runtime.sendMessage({
                    type: 'capture',
                    area: {
                        left: parseInt(selectionDiv.style.left),
                        top: parseInt(selectionDiv.style.top),
                        width,
                        height
                    }
                });

                isSelecting = false;
                document.body.classList.remove('selecting'); // Ensure the cursor returns
                selectionDiv.classList.remove('active', 'complete');
                selectionDiv.style.display = 'none';
                previewDiv.style.display = 'none';
                window.selectionScriptInjected = false;

                // Remove event listeners
                document.removeEventListener('mousedown', startSelection);
                document.removeEventListener('mousemove', updateSelection);
                document.removeEventListener('mouseup', endSelection);
                document.removeEventListener('keydown', cancelSelection);
            } else {
                selectionDiv.classList.remove('active');
                selectionDiv.style.display = 'none';
            }
        }

        function cancelSelection(e) {
            if (e.key === 'Escape') {
                isSelecting = false;
                document.body.classList.remove('selecting'); // Ensure the cursor returns
                selectionDiv.classList.remove('active', 'complete');
                selectionDiv.style.display = 'none';
                previewDiv.style.display = 'none';
                window.selectionScriptInjected = false;

                // Remove event listeners
                document.removeEventListener('mousedown', startSelection);
                document.removeEventListener('mousemove', updateSelection);
                document.removeEventListener('mouseup', endSelection);
                document.removeEventListener('keydown', cancelSelection);
            }
        }

        function trackCursor(e) {
            if (!isSelecting) {
                previewDiv.style.left = `${e.pageX - 15}px`;
                previewDiv.style.top = `${e.pageY - 15}px`;
            }
        }

        // Attach event listeners
        document.addEventListener('mousedown', startSelection);
        document.addEventListener('mousemove', updateSelection);
        document.addEventListener('mouseup', endSelection);
        document.addEventListener('keydown', cancelSelection);
        document.addEventListener('mousemove', trackCursor);

        // Ensure cursor preview appears
        document.body.classList.add('selecting');
        previewDiv.style.display = 'block';
    })();
}
