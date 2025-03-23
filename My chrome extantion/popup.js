document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-selection');
    
    if (startButton) {
        startButton.addEventListener('click', () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ['content.js']
                });
                // Close the popup after initiating the selection
                window.close();
            });
        });
    } else {
        console.error("Button with ID 'start-selection' not found.");
    }
});