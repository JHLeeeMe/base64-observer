/// background.js
///
///

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason == "install") {
    await chrome.storage.local.set({isActive: false});
  }
});

/// Shipping messages from popup.js to content-script_start.js
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.from == "popupjs-toggleBtn") {
    const localData = await chrome.storage.local.get("isActive");
    chrome.tabs.sendMessage(
      request.currentTabs[0].id,
      {from: "backgroundjs-popupjs-toggleBtn", enabled: localData.isActive}
    );
  }
});
