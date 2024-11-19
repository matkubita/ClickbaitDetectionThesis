// code for interacting with the popup
import { Detector } from "./detector.js";
import { getCurrentTab } from "./utils.js";

const activeTab = await getCurrentTab();
const sourceUrl = activeTab.url;

function setPredictionInfo(prediction) {
    if (prediction == 1) {
        document.getElementById('responseContent').textContent = "Beware, that's a clickbait!"
    } else if (prediction == 0) {
        document.getElementById('responseContent').textContent = "You are good to go!"
    } else {
        document.getElementById('responseContent').textContent = "Find out if the article is a clickbait"
    }
}

// check in the chrome storage if this page was previously analyzed
chrome.storage.local.get([sourceUrl]).then((result) => {
    const prediction = result[sourceUrl];
    setPredictionInfo(prediction);
    new Detector().setBadge(result[sourceUrl], activeTab.id);
});

// button action
document.getElementById('checkButton').addEventListener('click', async () => {
    document.getElementById('responseContent').textContent = "Analyzing...";
    // set up message listener
    chrome.runtime.onMessage.addListener(function(message) {
        if (message.action === 'sendContent') {
            setPredictionInfo(message.content);
            new Detector().setBadge(message.content, activeTab.id);
        }
    });
    // execute script in the active tab
    chrome.scripting.executeScript({
        target: {tabId: activeTab.id},
        files: ['prediction.js']
    });
});

// options button
document.getElementById('optionsButton').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('templates/options.html'));
    }
  });