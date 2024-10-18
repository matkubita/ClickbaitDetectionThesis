export class Detector {

    setBadge(prediction, tabId) {
        if (prediction == 1) {
            chrome.action.setBadgeBackgroundColor(
                { color: '#cf2525', tabId: tabId },
                () => {chrome.action.setBadgeText({ text: '!', tabId: tabId});}
            );
        } else if (prediction == 0) {
            chrome.action.setBadgeBackgroundColor(
                { color: '#32a852', tabId: tabId },
                 () => {chrome.action.setBadgeText({ text: ':)', tabId: tabId});}
                );
        } else {
            chrome.action.setBadgeText({});
        }
    }

}