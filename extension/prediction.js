function sendPredictionRequest(spoilerGeneration = true) {
    const sourceUrl = window.location.href;
    const htmlContent = document.documentElement.outerHTML;

    // Send a message to the background script to handle the request
    chrome.runtime.sendMessage({
        action: "sendPredictionRequest",
        payload: {
            sourceUrl: sourceUrl,
            htmlContent: htmlContent,
            spoilerGeneration: spoilerGeneration
        }
    }, (response) => {
        if (response && response.success) {
            const data = response.data;
            
            // send messages to popup or badge if necessary
            chrome.runtime.sendMessage({ action: 'sendContent', content: data });
            chrome.runtime.sendMessage({ action: 'setBadge', content: data });

            // save prediction in storage
            chrome.storage.local.set({ [sourceUrl]: data });
            console.log(`[CLICKGUARD] Values ${JSON.stringify(data, null, 2)} are set for ${sourceUrl}`);
            
        } else {
            console.error(`[CLICKGUARD] Error: ${response ? response.error : 'No response from background script'}`);
        }
    });
}

chrome.storage.sync.get(['spoilerGeneration']).then((result) => {
    const spoilerGeneration = result["spoilerGeneration"]
    sendPredictionRequest(spoilerGeneration);
}).catch((error) => {
    console.error("[CLICKGUARD] Error during getting spoiler generation flag, using default", error);
    sendPredictionRequest();
})
