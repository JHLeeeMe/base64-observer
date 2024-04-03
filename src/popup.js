/// popup.js
///
///

////////////////////////////////////////////////////////////////////////////////
/// Functions
////////////////////////////////////////////////////////////////////////////////
async function updateToggleBtnStatus() {
  try {
    const localData = await chrome.storage.local.get("isActive");
    const toggleBtn = document.getElementById("toggle-btn");
    toggleBtn.checked = localData.isActive;
  } catch (e) {
    console.error("Error updateToggleBtnStatus():", e);
  }
}

async function addToggleBtnChangeListener() {
  const toggleBtn = document.getElementById("toggle-btn");
  if (toggleBtn === null) {
    console.warn("toggleBtn is null.");
    return;
  }

  toggleBtn.addEventListener("change", async () => {
    try {
      const localData = await chrome.storage.local.get("isActive");
      toggleBtn.checked = !localData.isActive;

      chrome.storage.local.set({isActive: toggleBtn.checked});

      const tabs = await chrome.tabs.query({active: true, currentWindow: true});
      chrome.runtime.sendMessage({from: "popupjs-toggleBtn", currentTabs: tabs});
    } catch (e) {
      console.error("Error addToggleBtnChangeListener():", e);
    }
  });
}

async function DOMContentLoadedListener() {
  await updateToggleBtnStatus();
  addToggleBtnChangeListener();
}

function init() {
  document.addEventListener("DOMContentLoaded", DOMContentLoadedListener);
  if (document.readyState !== "loading") {
    DOMContentLoadedListener();
  }
}

////////////////////////////////////////////////////////////////////////////////
/// Main
////////////////////////////////////////////////////////////////////////////////
init();
