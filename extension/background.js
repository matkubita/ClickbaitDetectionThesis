// for console access
import { Detector } from "./detector.js";
import { getCurrentTab } from "./utils.js";

const DEFAULT_POST_DETECTION = "manual";
const DEFAULT_PRE_DETECTION = false;

// set default values for settings on extension start up 
async function setDefaults() {
    // post detection
    chrome.storage.sync.get(["postDetectionType"]).then((result) => {
        const postDetectionType = result["postDetectionType"];
        if (typeof postDetectionType === 'undefined') {
            console.log("Setting the default for post-click detection type to", DEFAULT_POST_DETECTION);
            chrome.storage.sync.set({["postDetectionType"]: DEFAULT_POST_DETECTION});
        } else {
            console.log("Post-click detection type already set to", postDetectionType);
        }
    }).catch((error) => {
        console.error("Error during setting default postDetectionType:", error);
    });
    // pre detection - search engine
    chrome.storage.sync.get(["searchEngineDetection"]).then((result) => {
        const searchEngineDetection = result["searchEngineDetection"];
        if (typeof searchEngineDetection === 'undefined') {
            console.log("Setting the default for search engine detection type to", DEFAULT_PRE_DETECTION);
            chrome.storage.sync.set({["searchEngineDetection"]: DEFAULT_PRE_DETECTION});
        } else {
            console.log("Search engine detection type already set to", searchEngineDetection);
        }
    }).catch((error) => {
        console.error("Error during setting default searchEngineDetection type:", error);
    });
    // monitored sites list
    chrome.storage.sync.set({"monitoredSites": ["https://www.thesun.co.uk/health/*/*", "*sportowefakty.wp.pl/pilka-nozna/*"]})
}

setDefaults();

let currentTabId = getCurrentTab();

const MINIMAL_TIME = 2;
let lastTime = new Date();  // last time badge was updated
let lastTabId = "";  // last tab id for which badge was updated
let lastUrl = "";  // last url for which badge was updated

// background tasks including badge changing
async function handleBackground() {

    console.log("Service worker has started");

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        console.log("Tab changed to tab", tabId, "status:", changeInfo.status);
        currentTabId = tabId;

        if (tab.url) {
            
            const now = new Date();
            const timePassedSeconds = (now - lastTime) / 1000;
            console.log("Seconds passed since last update", timePassedSeconds)
            
            // when new tab is being loaded, tab.url is available on several statuses
            // however we dont want to query the storage and update the badge for each tab loading status,
            // so we trigger badge update when either tabid/url was changed or time since last update is bigger than MINIMAL_TIME
            if (tabId != lastTabId || lastUrl != tab.url || timePassedSeconds > MINIMAL_TIME) {

                lastTime = new Date();
                lastTabId = tabId;
                lastUrl = tab.url;
                
                const url = tab.url;

                chrome.storage.local.get([url]).then((result) => {
                    const prediction = result[url];
                    if (typeof prediction !== 'undefined') {
                        console.log("Setting the badge for", url)
                        new Detector().setBadge(prediction, tabId);
                    } else {
                        console.log("No prediction for", url)
                    }
                }).catch((error) => {
                    console.error("Error during storage access:", error)
                });
            }
        }
    });
}

handleBackground();

// set up listener so content script can send message to set badge for current tab id
chrome.runtime.onMessage.addListener(function(message) {
    if (message.action === 'setBadge') {
        new Detector().setBadge(message.content, currentTabId);
    }
});