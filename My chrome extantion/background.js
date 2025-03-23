/* chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'capture') {
        chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            }

            // You need a way to crop the screenshot using canvas
            chrome.scripting.executeScript({
                target: { tabId: sender.tab.id },
                func: (dataUrl, area) => {
                    const img = new Image();
                    img.src = dataUrl;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = area.width;
                        canvas.height = area.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, -area.left, -area.top);
                        
                        const croppedImage = canvas.toDataURL('image/png');
                        console.log("Cropped Image:", croppedImage);
                        // You can send this cropped image back to the user
                    };
                },
                args: [dataUrl, message.area]
            });
        });
    }
});

 */





chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'capture') {
        chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            }

            // You need a way to crop the screenshot using canvas
            chrome.scripting.executeScript({
                target: { tabId: sender.tab.id },
                func: (dataUrl, area) => {
                    const img = new Image();
                    img.src = dataUrl;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = area.width;
                        canvas.height = area.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, -area.left, -area.top);
                        
                        const croppedImage = canvas.toDataURL('image/png');
                        //console.log("Cropped Image:", croppedImage);
                       
                        function sendImageToGemini(imageDataUrl) {
                            console.log("Sending image to Gemini...");
                        
                            // Extract only the Base64 part (remove 'data:image/png;base64,')
                            const base64Image = imageDataUrl.split(",")[1];

                          const GEMINI_API_KEY = "AIzaSyDkh25ShYP1XiyfEMD4bmdfg9j-pWXX_5I"; // Replace with your actual API key
                          const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;

                            const payload = {
                                contents: [{
                                    parts: [
                                        { "text": "Extract any text or code from this image." }, 
                                        { "inline_data": { "mime_type": "image/png", "data": base64Image } }
                                    ]
                                }]
                            };

                            fetch(GEMINI_ENDPOINT, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(payload)
                            })
                            .then(response => response.json())
                            .then(data => {
                                 //console.log("Gemini Response:", JSON.stringify(data));
                                
                                  // Extract text response
                                const extractedText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No text extracted";

                                 // Copy to clipboard
                                 navigator.clipboard.writeText(extractedText).then(() => {
                                 alert("Extracted text copied to clipboard!"); 
                                 }).catch(err => {
                                 console.error("Failed to copy text:", err);
                                 });

                                  // Stop content script after response
                                 chrome.runtime.sendMessage({ type: "stop-selection" });
                                })
                                .catch(error => {
                                console.error("Error sending to Gemini:", error);
                                alert("Error sending to Gemini: " + error);
                                 });
                        }
                        
                        
                        sendImageToGemini(croppedImage)
                    };
                },
                args: [dataUrl, message.area]
            });
        });
    }
});


