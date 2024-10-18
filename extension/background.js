// for console access
import { Detector } from "./detector.js";

const DEFAULT_RECOGNITION = "manual";

async function setDefaults() {
    chrome.storage.sync.get(["recognitionType"]).then((result) => {
        const recognitionType = result["recognitionType"];
        if (typeof recognitionType === 'undefined') {
            console.log("Setting the default for recognition type to", DEFAULT_RECOGNITION);
            chrome.storage.sync.set({["recognitionType"]: DEFAULT_RECOGNITION});
        } else {
            console.log("Recognition type setting already set to", recognitionType);
        }
    }).catch((error) => {
        console.error("Error during setting default recognitionType:", error);
    });
    chrome.storage.sync.set({"whitelist": ["example.com"]})
}

setDefaults();

const MINIMAL_TIME = 2;
let lastTime = new Date();  // last time badge was updated
let lastTabId = "";  // last tab id for which badge was updated
let lastUrl = "";  // last url for which badge was updated

async function handleBackground() {
    console.log("Service worker has started");
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        console.log("Tab changed to tab", tabId, "status:", changeInfo.status);

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

