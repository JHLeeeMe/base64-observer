# base64-observer
base64-observer is a Chrome extension  
that Detects & Decodes of base64-encoded text within the current web page.

## Key Features
#### Automatic Detection and Decoding
- Upon completion of the web page's DOM structure, the extension scans the page's text content for base64 encoded text, automatically detects, and decodes it. The decoded text is then added below the original content as a new element.
#### Dynamic Content Support
- Utilizes MutationObserver to decode newly loaded elements within the page following the same process, ensuring effective operation on dynamic websites.
#### Decode Selected Text
- Provides the functionality to decode and copy base64 encoded text to the clipboard when the user selects text with the mouse and right-clicks. If the selected text is base64 encoded, it is decoded and copied.

---

The base64-observer extension was created for personal use and was roughly put together, so it will not function perfectly in all situations.
