// code for interacting with popup

import { getCurrentTab } from "./utils.js";

const activeTab = await getCurrentTab();
const sourceUrl = activeTab.url;

// TODO -> special functions for setting messages

// check in the chrome storage if this page was previously analyzed
chrome.storage.local.get([sourceUrl]).then((result) => {
    if (result[sourceUrl] == 1) {
        document.getElementById('responseContent').textContent = "Beware, that's a clickbait!"
    } else if (result[sourceUrl] == 0) {
        document.getElementById('responseContent').textContent = "You are good to go!"
    }
});

// button action
document.getElementById('checkButton').addEventListener('click', async () => {
    document.getElementById('responseContent').textContent = "Analyzing...";
    // set up message listener
    chrome.runtime.onMessage.addListener(function(message) {
        if (message.action === 'sendContent') {
            if (message.content == 1) {
                document.getElementById('responseContent').textContent = "Beware, that's a clickbait!"
            } else if (message.content == 0) {
                document.getElementById('responseContent').textContent = "You are good to go!"
            } else {
                document.getElementById('responseContent').textContent = "Unknown response. Cannot check for clickbaits :("
            }
        }
    });
    const tabId = activeTab.id;
    // execute script in active tab
    chrome.scripting.executeScript({
        target: {tabId: tabId},
        files: ['content.js']
    });
});