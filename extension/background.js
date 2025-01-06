// background service worker
import { Detector } from "./detector.js";

const DEFAULT_POST_DETECTION = "manual";
const DEFAULT_SPOILER_GENERATION = true;
const DEFAULT_PRE_DETECTION_SEARCH = false;
const DEFAULT_PRE_DETECTION_NEWS = false;
const MONITORED_SITES = ["https://www.thesun.co.uk/health/*/*/"];

const PROXY_URL = 'https://clickguard-179698808618.europe-central2.run.app'; 
// const PROXY_URL = 'http://127.0.0.1:8080'; 

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
    // spoiler generation
    chrome.storage.sync.get(["spoilerGeneration"]).then((result) => {
        const spoilerGeneration = result["spoilerGeneration"];
        if (typeof spoilerGeneration === 'undefined') {
            console.log("Setting the default for spoilerGeneration to", DEFAULT_SPOILER_GENERATION);
            chrome.storage.sync.set({["spoilerGeneration"]: DEFAULT_SPOILER_GENERATION});
        } else {
            console.log("spoilerGeneration flag already set to", spoilerGeneration);
        }
    }).catch((error) => {
        console.error("Error during setting default spoilerGeneration flag:", error);
    });
    // pre detection - search engine
    chrome.storage.sync.get(["searchEngineDetection"]).then((result) => {
        const searchEngineDetection = result["searchEngineDetection"];
        if (typeof searchEngineDetection === 'undefined') {
            console.log("Setting the default for search engine detection type to", DEFAULT_PRE_DETECTION_SEARCH);
            chrome.storage.sync.set({["searchEngineDetection"]: DEFAULT_PRE_DETECTION_SEARCH});
        } else {
            console.log("Search engine detection type already set to", searchEngineDetection);
        }
    }).catch((error) => {
        console.error("Error during setting default searchEngineDetection type:", error);
    });
    // pre detection - search engine
    chrome.storage.sync.get(["newsPortalDetection"]).then((result) => {
        const newsPortalDetection = result["newsPortalDetection"];
        if (typeof newsPortalDetection === 'undefined') {
            console.log("Setting the default for news portal detection type to", DEFAULT_PRE_DETECTION_NEWS);
            chrome.storage.sync.set({["newsPortalDetection"]: DEFAULT_PRE_DETECTION_NEWS});
        } else {
            console.log("Search engine detection type already set to", newsPortalDetection);
        }
    }).catch((error) => {
        console.error("Error during setting default newsPortalDetection type:", error);
    });
    // monitored sites list
    chrome.storage.sync.set({"monitoredSites": MONITORED_SITES});
}

setDefaults();


let currentTabId;
const MINIMAL_TIME = 2;
let lastTime = new Date();  // last time badge was updated
let lastTabId = "";  // last tab id for which badge was updated
let lastUrl = "";  // last url for which badge was updated

// background tasks including badge changing
async function handleBadgeSetting() {
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
                    const data = result[url];
                    if (typeof data !== 'undefined') {
                        console.log("Setting the badge for", url)
                        new Detector().setBadge(data, tabId);
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

handleBadgeSetting();

// set up listener so content script can send message to set badge for current tab id
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'setBadge') {
        new Detector().setBadge(message.content, currentTabId);
        if (typeof message.content !== 'undefined') {
            if (message.content.prediction == 1) {
                console.log("[CLICKGUARD] Opening the popup");
                chrome.action.openPopup().then(() => {
                    console.log("[CLICKGUARD] Popup has been opened");
                }).catch((error) => {
                    console.log("[CLICKGUARD] Popup is already opened");
                })
            }
        }
    } else if (message.action === "sendPredictionRequest") {

        const { sourceUrl, htmlContent, spoilerGeneration } = message.payload;

        const endpointUrl = `${PROXY_URL}/extract_and_predict`;

        fetch(endpointUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: sourceUrl,
                html: htmlContent,
                generateSpoiler: spoilerGeneration
            })
        })
        .then(response => response.json())
        .then(data => {
            // respond back to the content script
            sendResponse({ success: true, data: data });
            console.log(`[CLICKGUARD] Request to proxy server succesfull`)
        })
        .catch((error) => {
            sendResponse({ success: false, error: error.message });
            console.error(`[CLICKGUARD] Error during prediction: ${error.message}`);
        });

        // return true to keep the sendResponse callback alive
        return true;

    } else if (message.action === "sendPreDetectionRequest") {
              
        const { sourceUrl, htmlContent } = message.payload;
    
        const endpointUrl = `${PROXY_URL}/predetect`;
    
        fetch(endpointUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: sourceUrl,
                html: htmlContent
            })
        })
        .then(response => response.json())
        .then(data => {
            sendResponse({ success: true, data: data });
            console.log(`[CLICKGUARD] Request to proxy server succesfull`)
        })
        .catch((error) => {
            sendResponse({ success: false, error: error.message });
            console.error(`[CLICKGUARD] Error during prediction: ${error.message}`);
        });

        return true;
    }
});

  