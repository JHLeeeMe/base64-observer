/// background.js
///
///
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason == "install") {
    chrome.storage.local.set({isActive: false});
  }
});

/// Shipping messages from popup.js to content-script_start.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.from == "popupjs-toggleBtn") {
    chrome.storage.local.set({isActive: request.enabled});

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {from: "backgroundjs-popupjs-toggleBtn", enabled: request.enabled});
    });
  }
});
