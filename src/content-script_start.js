/// content-script_start.js
///
///

////////////////////////////////////////////////////////////////////////////////
/// Patterns & Variables
////////////////////////////////////////////////////////////////////////////////
const BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:(?:[A-Za-z0-9+/]{3}=)|(?:[A-Za-z0-9+/]{2}==))?$/;
const BASE64_URLSAFE_PATTERN = /^(?:[A-Za-z0-9_-]{4})*(?:(?:[A-Za-z0-9_-]{3}=)|(?:[A-Za-z0-9_-]{2}==))?$/;
const BASE64_PATTERN_LIST = [BASE64_PATTERN, BASE64_URLSAFE_PATTERN];

const URL_PATTERN = /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

const EXCLUDED_TAGS = ["button", "a", "i", "em", "code"];

let messageElem = null;
let observer = null;
let decodedTextMap = new Map();
let eventListeners = [];

////////////////////////////////////////////////////////////////////////////////
/// Functions
////////////////////////////////////////////////////////////////////////////////
function detectAndDecodeTextRecursive(node, pattern) {
  if (node.nodeType === Node.ELEMENT_NODE
      && EXCLUDED_TAGS.includes(node.tagName.trim().toLowerCase())) {
    return;
  }

  if (node.nodeType === Node.TEXT_NODE) {
    const matches = node.textContent.match(pattern);
    if (matches
        && matches[0] !== ""
        && !/^\d+$/.test(matches[0])) {
      let decodedText;
      try {
        decodedText = atob(matches[0]);
      } catch(e) {
        const base64String = matches[0].replace(/-/g, '+').replace(/_/g, '/');
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        decodedText = atob(base64String + padding);
      }

      decodedTextMap.set(node, decodedText);
    }
  }

  for (let i = 0; i < node.childNodes.length; i++) {
    detectAndDecodeTextRecursive(node.childNodes[i], pattern);
  }
}

function insertNode(node, text) {
  let newTag = document.createElement("div");
  newTag.classList.add("inserted-tag");

  if (isUrl(text)) {
    let newATag = document.createElement("a");
    newATag.classList.add("inserted-tag");
    newATag.href = text;
    newATag.textContent = "[ " + text + " ]";
    newTag.appendChild(newATag);
  } else {
    newTag.textContent = "[ " + text + " ]";
  }

  const parentNode = node.parentNode;
  parentNode.insertBefore(newTag, node.nextSibling);
}

function isUrl(text) {
  return URL_PATTERN.test(text);
}

function showMessage(message) {
  messageElem.textContent = message;
  messageElem.style.display = "block";

  setTimeout(() => {  // fade-in
    messageElem.style.opacity = 1;
  }, 10);

  setTimeout(() => {  // fade-out
    messageElem.style.opacity = 0;
    setTimeout(() => {
      messageElem.style.display = "none";
    }, 500);
  }, 1000);
}

function preventDefaultContextMenu(event) {
  event.preventDefault();
  document.removeEventListener('contextmenu', preventDefaultContextMenu);
}

function mouseDownListener(event) {
  if (event.button !== 2) {
    return;
  }

  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length === 0
      || /^\d+$/.test(selectedText)) {
    return;
  }

  if (!BASE64_PATTERN.test(selectedText) &&
      !BASE64_URLSAFE_PATTERN.test(selectedText)) {
    return;
  }

  document.addEventListener('contextmenu', preventDefaultContextMenu);

  event.preventDefault();

  let decodedText;
  try {
    decodedText = atob(selectedText);
  } catch(e) {
    const base64String = selectedText.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    decodedText = atob(base64String + padding);
  }

  navigator.clipboard
    .writeText(decodedText)
    .then(() => {
      showMessage("Copied");
    }, () => {
      showMessage("Failed to copy");
    });
}

function DOMContentLoadedListener() {
  if (observer !== null) {
    return;
  }
  
  // insert <div class="inserted-tag" id="message"></div>
  let messageTag = document.createElement("div");
  messageTag.classList.add("inserted-tag");
  messageTag.id = "message";
  document.body.insertBefore(messageTag, document.body.firstChild);
  messageElem = document.querySelector(".inserted-tag#message");

  BASE64_PATTERN_LIST.forEach((pattern) => {
    detectAndDecodeTextRecursive(document.body, pattern);
  });

  for (const [node, text] of decodedTextMap.entries()) {
    insertNode(node, text);
  }

  decodedTextMap.clear();

  // Create MutationObserver
  observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        BASE64_PATTERN_LIST.forEach((pattern) => {
          detectAndDecodeTextRecursive(node, pattern);
        });
      });
    });

    for (const [node, text] of decodedTextMap.entries()) {
      insertNode(node, text);
    }

    decodedTextMap.clear();
  });

  // Observe
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function removeAllEventListeners() {
  eventListeners.forEach(({type, listener}) => {
    document.removeEventListener(type, listener);
  });
  eventListeners = [];
}

function onMessageListener(message, sender, sendResponse) {
  if (message.from !== "backgroundjs-popupjs-toggleBtn") {
    return;
  }

  if (message.enabled) {
    init();
  } else {
    removeAllEventListeners();

    if (observer !== null) {
      observer.disconnect();
      observer = null;
    }

    document.querySelectorAll('.inserted-tag').forEach(node => node.remove());
    messageElem = null;

    decodedTextMap.clear();
  }
}

/// Initialization
///   1. Detect & Decode encoded-text
///   2. Create & Run Observer for new loaded elements
///   3. Select text & right mouse down -> copy decoded text to clipboard
///
function init() {
  document.addEventListener("DOMContentLoaded", DOMContentLoadedListener);
  eventListeners.push({
    type: 'DOMContentLoaded', listener: DOMContentLoadedListener});

  if (document.readyState !== "loading") {  
    DOMContentLoadedListener();
  }

  document.addEventListener('mousedown', mouseDownListener);
  eventListeners.push({
    type: 'mousedown', listener: mouseDownListener});
}

async function main() {
  try {
    const localData = await chrome.storage.local.get("isActive");
    if (localData.isActive) {
      init();
    }
  } catch (e) {
    console.error("Error main():", e);
    return;
  }

  /// Add message Listener for popup menu
  ///
  chrome.runtime.onMessage.addListener(onMessageListener);
}

////////////////////////////////////////////////////////////////////////////////
/// Main
////////////////////////////////////////////////////////////////////////////////
main();
