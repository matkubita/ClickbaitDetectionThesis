export class Detector {

    setBadge(predictionData, tabId) {
        console.log(`[CLICKGUARD] Setting badge for tab ${tabId}`)
        // check if data is valid
        if (typeof predictionData === 'undefined') {
            return;
        }
        if (typeof tabId !== 'number') {
            return;
        }
        if (typeof predictionData.probability !== 'number') {
            return;
        }

        if (predictionData.probability >= 0.6) {
            chrome.action.setBadgeBackgroundColor(
                { color: '#cf2525', tabId: tabId },
                () => {chrome.action.setBadgeText({ text: '!', tabId: tabId});}
            );
        } else if (predictionData.probability >= 0.4) {
            chrome.action.setBadgeBackgroundColor(
                { color: '#e9d502', tabId: tabId },
                 () => {chrome.action.setBadgeText({ text: '!', tabId: tabId});}
                );
        } else if (predictionData.probability >= 0) {
            chrome.action.setBadgeBackgroundColor(
                { color: '#32a852', tabId: tabId },
                    () => {chrome.action.setBadgeText({ text: 'v', tabId: tabId}, () => {
                        chrome.action.setBadgeTextColor({ color: '#FFFFFF', tabId: tabId})
                    });}
                );
        } else {
            chrome.action.setBadgeText({});
        }
    }

}