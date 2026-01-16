document.getElementById("apply").addEventListener("click", () => {
    const status = document.getElementById("status");
    status.style.display = "block";
    status.textContent = "Processing...";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["content.js"],
        }, () => {
            status.textContent = "Applied!";
            setTimeout(() => {
                status.style.display = "none";
            }, 2000);
        });
    });
});
