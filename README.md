# base64-observer
A Chrome extension for detecting and decoding base64-encoded text on web pages.

## Key Features
#### Auto-Detect & Decode
- Scans and decodes base64 text automatically once a page's DOM is fully loaded, displaying the decoded text below the original.
#### Dynamic Content Support
- Utilizes MutationObserver to decode newly loaded elements within the page.
#### Text Selection Decoding
- decode and copy base64 encoded text to the clipboard when the user selects text with the mouse and right-clicks. (If the selected text is base64 encoded, it is decoded and copied.)

---

Note: base64-observer is built for personal use and may not work perfectly in every scenario.
