document.getElementById('toggle-btn').addEventListener("change", () => {
    const isChecked = document.getElementById("toggle-btn").checked;
    chrome.runtime.sendMessage({ action: "toggle", enabled: isChecked });
});
