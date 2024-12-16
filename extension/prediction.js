// backend functionality - calling api for predictions

function sendPredictionRequest(spoilerGeneration = false) {
    const sourceUrl = window.location.href;
    const htmlContent = document.documentElement.outerHTML;
    // const endpointUrl = 'https://clickguard.eu.pythonanywhere.com/extract_and_predict'; 
    const endpointUrl = 'http://127.0.0.1:5000/extract_and_predict'; 

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
        // send prediction data to popup
        chrome.runtime.sendMessage({action: 'sendContent', content: data});
        // send message to background script
        chrome.runtime.sendMessage({action: 'setBadge', content: data});
        // save prediction in storage
        chrome.storage.local.set({[sourceUrl]: data});
        console.log(`[CLICKGUARD] Values ${JSON.stringify(data, null, 2)} are set for ${sourceUrl}`);
    })
    .catch((error) => {
        // add handlers when api call is not succesfull
        chrome.runtime.sendMessage({action: 'SendContent', content: `an error occured during fetching prediction: ${error}`})
    });
}

chrome.storage.sync.get(['spoilerGeneration']).then((result) => {
    const spoilerGeneration = result["spoilerGeneration"]
    sendPredictionRequest(spoilerGeneration);
}).catch((error) => {
    console.error("[CLICKGUARD] Error during getting spoiler generation flag, using default", error);
    sendPredictionRequest();
})
