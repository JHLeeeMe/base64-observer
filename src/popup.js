/*
document.getElementById('toggle-btn').addEventListener("change", () => {
    const isChecked = document.getElementById("toggle-btn").checked;
    chrome.runtime.sendMessage({ action: "toggle", enabled: isChecked });
});
*/

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-btn');

  chrome.storage.local.get('isActive', (data) => {
    toggleBtn.checked = !!data.isActive;
  });

  toggleBtn.addEventListener("change", () => {
    const isChecked = toggleBtn.checked;
    
    chrome.storage.local.set({isActive: isChecked});

    chrome.runtime.sendMessage({from: "popupjs-toggleBtn", enabled: isChecked});
  });
});
