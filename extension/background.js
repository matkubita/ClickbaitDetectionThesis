// for console access
import { Detector } from "./detector.js";
// import { getCurrentTab } from "./utils.js";

async function handleBackground() {
    // const activeTab = await getCurrentTab();
    // const sourceUrl = activeTab.url;
    console.log("we are inside")
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        console.log("Tab changed to tab", tabId)
        const url = tab.url
        chrome.storage.local.get([url]).then((result) => {
            const prediction = result[url]
            if (typeof prediction !== undefined) {
                console.log("Setting the badge for", url)
                new Detector().setBadge(prediction);
            } else {
                console.log("No prediction for", url)
            }
        });
    });
}

handleBackground();
