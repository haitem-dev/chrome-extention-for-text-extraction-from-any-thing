# chrome-extention-for-text-extraction-from-any-thing


# Screen Selection & OCR Chrome Extension

## Overview
This Chrome extension allows users to select a portion of their screen, capture a screenshot, and extract text or code from the image using Google's Gemini AI. The extracted content is then automatically copied to the clipboard for easy use.

## Features
- **Screen Selection:** Click and drag to select a portion of your screen.
- **Screenshot Capture:** The selected area is captured as an image.
- **AI-Powered OCR:** The image is processed using Gemini AI to extract text or code.
- **Clipboard Integration:** The extracted content is automatically copied to the clipboard.
- **Seamless UI:** A simple and intuitive interface for quick and efficient usage.

## Installation

1. **Download the source code** or clone the repository:
   ```sh
   git clone https://github.com/yourusername/your-extension.git
   ```
2. **Open Chrome and navigate to:**
   ```
   chrome://extensions/
   ```
3. **Enable Developer Mode** (toggle in the top-right corner).
4. Click **Load Unpacked** and select the downloaded folder.
5. The extension is now installed and ready to use.

## Usage
1. Click the extension icon in the Chrome toolbar.
2. Select the "Start Selection" button.
3. Click and drag on the screen to define the capture area.
4. The selection is processed and sent to Gemini AI.
5. The extracted text or code is automatically copied to your clipboard.
6. Paste it anywhere using `Ctrl + V` (Windows/Linux) or `Cmd + V` (Mac).

## Permissions
This extension requires the following permissions:
- `activeTab` – To interact with the active webpage.
- `scripting` – To inject scripts for screen selection.
- `storage` – To save user preferences.
- `clipboardWrite` – To copy extracted text/code to the clipboard.

## Technologies Used
- **JavaScript (ES6)** for core logic
- **Chrome Extensions API** for interacting with the browser
- **Google Gemini AI API** for text extraction
- **HTML & CSS** for UI design

## Contributing
Contributions are welcome! Feel free to fork the repository and submit pull requests.

## License
This project is licensed under the [MIT License](LICENSE).

## Contact
For issues or feature requests, open an issue on GitHub .

