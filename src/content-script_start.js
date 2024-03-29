////////////////////////////////////////////////////////////////////////////////
/// Patterns & Variables
////////////////////////////////////////////////////////////////////////////////
const BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:(?:[A-Za-z0-9+/]{3}=)|(?:[A-Za-z0-9+/]{2}==))?$/;
const BASE64_URLSAFE_PATTERN = /^(?:[A-Za-z0-9_-]{4})*(?:(?:[A-Za-z0-9_-]{3}=)|(?:[A-Za-z0-9_-]{2}==))?$/;
const PATTERN_LIST = [BASE64_PATTERN, BASE64_URLSAFE_PATTERN];

const URL_PATTERN = /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

const EXCLUDED_TAGS = ["button", "a", "i"];

let decodedTextMap = new Map();

////////////////////////////////////////////////////////////////////////////////
/// Functions
////////////////////////////////////////////////////////////////////////////////
function detectAndDecodeTextRecursive(node, pattern) {
  if (node.nodeType === Node.TEXT_NODE &&
      !EXCLUDED_TAGS.includes(node.parentElement.tagName.toLowerCase())) {
    const matches = node.textContent.match(pattern);
    if (matches &&
        matches[0] !== "" &&
        !/^\d+$/.test(matches[0])) {
      decodedTextMap.set(node, atob(matches[0])) ;
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


////////////////////////////////////////////////////////////////////////////////
/// Main
////////////////////////////////////////////////////////////////////////////////
let initialized = false;
document.addEventListener('DOMContentLoaded', () => {
  if (initialized) {
    return;
  }

  PATTERN_LIST.forEach(pattern => {
    detectAndDecodeTextRecursive(document.body, pattern);
  });

  for (const [node, text] of decodedTextMap.entries()) {
    insertNode(node, text);
  }

  decodedTextMap.clear();

  // Create MutationObserver
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        PATTERN_LIST.forEach(pattern => {
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

  initialized = true;
});
