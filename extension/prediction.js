// backend functionality - calling api for predictions

function sendPredictionRequest() {
    const sourceUrl = window.location.href;  // needed as a key for storing predictions
    const htmlContent = document.documentElement.outerHTML;

    const endpointUrl = 'https://clickguard.eu.pythonanywhere.com/extract_and_predict'; 
    // const endpointUrl = 'http://127.0.0.1:5000/extract_and_predict'; 

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
        // send prediction data to popup
        chrome.runtime.sendMessage({action: 'sendContent', content: data.prediction});
        // save prediction in storage
        chrome.storage.local.set({[sourceUrl]: data.prediction});
        console.log(`Value ${data.prediction} is set for ${sourceUrl}`);
    })
    .catch((error) => {
        chrome.runtime.sendMessage({action: 'SendContent', content: `an error occured during fetching prediction: ${error}`})
    });
}

sendPredictionRequest();