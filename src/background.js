/// background.js
///
///

////////////////////////////////////////////////////////////////////////////////
/// Functions
////////////////////////////////////////////////////////////////////////////////
async function onInstalledListener(details) {
  if (details.reason !== "install") {
    return;
  }

  try {
    await chrome.storage.local.set({isActive: false})
  } catch (e) {
    console.error("Error onInstalledListener(...):", e);
  }
}

/// Shipping messages from popup.js to content-script_start.js
///
async function onMessageListener(request, sender, sendResponse) {
  if (request.from !== "popupjs-toggleBtn") {
    return;
  }

  try {
    const localData = await chrome.storage.local.get("isActive");
    chrome.tabs.sendMessage(
      request.currentTabs[0].id,
      {from: "backgroundjs-popupjs-toggleBtn", enabled: localData.isActive}
    );
  } catch (e) {
    console.error("Error onMessageListener(...):", e);
  }
}

function init() {
  chrome.runtime.onInstalled.addListener(onInstalledListener);
  chrome.runtime.onMessage.addListener(onMessageListener);
}

function main() {
  init();
}

////////////////////////////////////////////////////////////////////////////////
/// Main
////////////////////////////////////////////////////////////////////////////////
main();
