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

        if (predictionData.prediction == 1) {
            chrome.action.setBadgeBackgroundColor(
                { color: '#cf2525', tabId: tabId },
                () => {chrome.action.setBadgeText({ text: '!', tabId: tabId});}
            );
        } else if (predictionData.prediction == 0) {
            chrome.action.setBadgeBackgroundColor(
                { color: '#32a852', tabId: tabId },
                 () => {chrome.action.setBadgeText({ text: ':)', tabId: tabId});}
                );
        } else {
            chrome.action.setBadgeText({});
        }
    }

}