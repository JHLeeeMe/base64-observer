# base64-observer
![copyToClipboard](https://github.com/JHLeeeMe/base64-observer/assets/31606119/661a3f82-bde0-415b-b694-f35f27652344)  
A Chrome extension for detecting and decoding base64-encoded text on web pages.

## Key Features
#### Auto-Detect & Decode
- Scans and decodes base64 text automatically once a page's DOM is fully loaded, displaying the decoded text below the original.
#### Dynamic Content Support
- Utilizes MutationObserver to decode newly loaded elements within the page.
#### Selected Text Decoding & Copy
- decode and copy base64 encoded text to the clipboard when the user selects text with the mouse and right-clicks. (If the selected text is base64 encoded, it is decoded and copied.)

---
Note: base64-observer is built for personal use and may not work perfectly in every scenario.
