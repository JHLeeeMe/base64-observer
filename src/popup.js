document.getElementById('toggle-btn').addEventListener('click', () => {
    document.getElementById("toggle-btn-label").textContent = "On";
    chrome.runtime.sendMessage({ action: "toggle" });
});
