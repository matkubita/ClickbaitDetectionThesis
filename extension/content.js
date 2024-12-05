const PREPARED_WEBSITES_URLS = new Map(); // for easy if-else clauses writing
PREPARED_WEBSITES_URLS.set("https://www.google.com/search", 'google');

// runs pre detection pipeline
async function runPreDetection() {

    const currentUrl = window.location.href;

    const foundKey = [...PREPARED_WEBSITES_URLS.keys()].find(prefix => currentUrl.startsWith(prefix)); 
    const foundName = PREPARED_WEBSITES_URLS.get(foundKey) // e.g google

    // if current website is on the list
    if (typeof foundName !== 'undefined') {
        chrome.storage.sync.get(["searchEngineDetection"]).then((result) => {
            const searchEngineDetection = result["searchEngineDetection"];
            if (searchEngineDetection === true) {
                sendPreDetectionRequest(foundName);
            } else {
                console.log("Configured URL was detected, but search engine detection is turned off")
            }
        }).catch((error) => {
            console.error("Error during setting default searchEngineDetection type:", error);
        });
    }
  }

// makes and sets predictions for preclick detection
function sendPreDetectionRequest() {
      
    const sourceUrl = window.location.href;
    const htmlContent = document.documentElement.outerHTML;

    // const endpointUrl = `https://clickguard.eu.pythonanywhere.com/predetect`;
    const endpointUrl = 'http://127.0.0.1:5000/predetect'; 

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
        const predictionMap = new Map(Object.entries(data.predictions));
        console.log(`[CLICKGUARD] Received predictions for page ${sourceUrl}`);
        // if (foundName == 'google') {
        //     addIconsGoogle(predictionMap);
        // }
        addIcons(predictionMap); // easy universal function
    })
    .catch((error) => {
        console.log(`[CLICKGUARD] An error occured during fetching prediction: ${error}`)
    });
}

function createIcon(prediction) {
    const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgIcon.setAttribute("width", "16");
    svgIcon.setAttribute("height", "16");
    svgIcon.setAttribute("stroke-width", "1");
    svgIcon.setAttribute("viewBox", "-1 -1 18 18");
    svgIcon.setAttribute("style", "margin-left: 8px")
    if (prediction == 1) {
        svgIcon.setAttribute("fill", "#dc3545"); // red
        svgIcon.setAttribute("stroke", "#dc3545");
        svgIcon.setAttribute("class", "bi bi-exclamation-circle");
        svgIcon.innerHTML = `<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>`
    } else if (prediction == 0) {
        svgIcon.setAttribute("fill", "#198754"); // green
        svgIcon.setAttribute("stroke", "#198754");
        svgIcon.setAttribute("class", "bi bi-check-circle");
        svgIcon.innerHTML = `<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>`
    }
    return svgIcon
}

function addIcons(predictionMap) {
    console.log('[CLICKGUARD] Adding icons');
    const anchors = document.querySelectorAll('a');
    anchors.forEach(anchor => {
        const hrefValue = anchor.getAttribute('href');
        const prediction = predictionMap.get(hrefValue);
        if (typeof prediction !== 'undefined') {
            icon = createIcon(prediction);
            anchor.append(icon);
        }
    })
}

// // adds icons next to the headlines in google search
// function addIconsGoogle(predictionMap) {
//     // select all divs with the class 'MjjYud'
//     console.log('[CLICKGUARD] Adding icons')
//     const divs = document.querySelectorAll('div.MjjYud');

//     divs.forEach(div => {
//         // find all anchor elements inside the div, probably its enough to select only first anchor
        
//         const anchors = div.querySelectorAll('a');

//         anchors.forEach(anchor => {
//             // check if there is an h3 element inside the anchor - page title
//             const h3Element = anchor.querySelector('h3');
//             if (h3Element) {
//                 const hrefValue = anchor.getAttribute('href');
//                 const prediction = predictionMap.get(hrefValue);
//                 if (prediction == 1) {
//                     const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//                     svgIcon.setAttribute("width", "16");
//                     svgIcon.setAttribute("height", "16");
//                     svgIcon.setAttribute("fill", "#dc3545"); // red
//                     svgIcon.setAttribute("stroke", "#dc3545");
//                     svgIcon.setAttribute("stroke-width", "1");
//                     svgIcon.setAttribute("class", "bi bi-exclamation-circle");
//                     svgIcon.setAttribute("viewBox", "-1 -1 18 18");
//                     svgIcon.setAttribute("style", "margin-left: 8px")
//                     svgIcon.innerHTML = `<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
//                                         <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>`
//                     // insert icon before the h3 text
//                     h3Element.append(svgIcon);
//                 } else if (prediction == 0) {
//                     const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//                     svgIcon.setAttribute("width", "16");
//                     svgIcon.setAttribute("height", "16");
//                     svgIcon.setAttribute("fill", "#198754"); // green
//                     svgIcon.setAttribute("stroke", "#198754");
//                     svgIcon.setAttribute("stroke-width", "1");
//                     svgIcon.setAttribute("class", "bi bi-check-circle");
//                     svgIcon.setAttribute("viewBox", "-1 -1 18 18");
//                     svgIcon.setAttribute("style", "margin-left: 8px")
//                     svgIcon.innerHTML = `<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
//                                         <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>`
//                     // insert icon before the h3 text
//                     h3Element.append(svgIcon);                
//                 }
//             }
//         });
//     });
// }

runPreDetection();

async function runPostDetection() {

    console.log("[CLICKGUARD] Checking post-click detection type");
    const currentUrl = window.location.href;

    // exit early if the page was already processed
    try {
        const result = await chrome.storage.local.get([currentUrl]);
        const data = result[currentUrl];
        if (typeof data !== 'undefined') {
            console.log("[CLICKGUARD] Prediction already set for this URL");
            return;
        }
    } catch (error) {
        console.error("Error during storage access:", error);
        return;
    }

    chrome.storage.sync.get(["postDetectionType"]).then((result) => {
        const postDetectionType = result['postDetectionType'];
        console.log(`[CLICKGUARD] Current post-click detection type: ${postDetectionType}`);

        // monitored
        if (postDetectionType == 'monitored') {
            console.log("[CLICKGUARD] Running monitored post-click detection");
            checkMonitoredSites(currentUrl);
        // semi automatic
        } else if (postDetectionType == "semiAutomatic") {
            console.log("[CLICKGUARD] Running semiAutomatic post-click detection");

            const ogTypeElement = document.head.querySelector("[property~='og:type']");
            if (ogTypeElement && ogTypeElement.content === 'article') {
                console.log("[CLICKGUARD] Article detected by meta property");
                sendPredictionRequest();
            } else {
                console.log("[CLICKGUARD] No article meta property detected");
                checkMonitoredSites(currentUrl);
            }
        // automatic
        } else if (postDetectionType == "automatic") {
            console.log("[CLICKGUARD] Running semiAutomatic post-click detection")
            sendPredictionRequest();
        }
    }).catch((error) => {
        console.error("[CLICKGUARD] Error during getting default post detection type:", error);
    })
}

// test if str matches pattern, pattern includes only * characters, which stand for any string of any length
function matchesPattern(pattern, str) {
    const escapedPattern = pattern.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&');
    const regexPattern = new RegExp('^' + escapedPattern.replace(/\*/g, '.*') + '$');
    return regexPattern.test(str);
}

function checkMonitoredSites(currentUrl) {
    chrome.storage.sync.get(["monitoredSites"]).then((result) => {
        const monitoredSitesList = result["monitoredSites"];
        
        for (let i = 0; i < monitoredSitesList.length; i++) {
            let webUrlPattern = monitoredSitesList[i];
            if (matchesPattern(webUrlPattern, currentUrl)) {
                console.log(`[CLICKGUARD] Matched url: ${webUrlPattern}`)
                sendPredictionRequest();
                break;
            }
        }
    }).catch((error) => {
        console.error("[CLICKGUARD] Error during getting monitored sites list:", error);
    });
}

function sendPredictionRequest() {
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
            html: htmlContent
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
        console.log(`[CLICKGUARD] Values ${data} is set for ${sourceUrl}`);
    })
    .catch((error) => {
        chrome.runtime.sendMessage({action: 'SendContent', content: `an error occured during fetching prediction: ${error}`})
    });
}

runPostDetection();