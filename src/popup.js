/// popup.js
///
///

let toggleBtn = null;
let localData = null;

document.addEventListener("DOMContentLoaded", async () => {
  toggleBtn = document.getElementById('toggle-btn');
  localData = await chrome.storage.local.get("isActive");
  toggleBtn.checked = localData.isActive;

  toggleBtn.addEventListener("change", async () => {
    localData = await chrome.storage.local.get("isActive");
    toggleBtn.checked = !localData.isActive;

    chrome.storage.local.set({isActive: toggleBtn.checked});

    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.runtime.sendMessage({from: "popupjs-toggleBtn", currentTabs: tabs});
  });
});
