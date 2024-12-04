// code for interacting with the popup
import { Detector } from "./detector.js";
import { getCurrentTab } from "./utils.js";

const activeTab = await getCurrentTab();
const sourceUrl = activeTab.url;

function setPredictionInfo(predictionData) {

    if (typeof predictionData === 'undefined') {
        console.log(`[CLICKGUARD] predictionData is undefined or null ${JSON.stringify(predictionData, null, 2)}`);
        return;
    }

    console.log(`[CLICKGUARD] Setting info for data ${JSON.stringify(predictionData, null, 2)}`)

    const responseContent = document.getElementById('responseContent');
    const predictionDetails = document.getElementById('predictionDetails');

    // Set response message based on prediction
    if (predictionData.prediction == 1) {
        responseContent.textContent = "Beware, that's a clickbait!";
    } else if (predictionData.prediction == 0) {
        responseContent.textContent = "You are good to go!";
    } else {
        responseContent.textContent = "Find out if the article is a clickbait";
    }

    const probabilityHtml = `
        <div style="padding-top: 10px; margin-bottom: 0px;">
            Clickbait probability: <h4 style="color: orangered; display: inline;"><b>${predictionData.probability * 100}%</b></h4>
        </div>`;
    let spoilerHtml = ``
    if (predictionData.prediction == 1) {
        spoilerHtml = `
        <p style="padding-top: 10px; margin-bottom: 0px;">
            Spoiler: <b>${predictionData.spoiler}</b>
        </p>`;
    }
    const explanationHtml = `
        <p style="padding-top: 10px; margin-bottom: 0px; margin-left: 20px; margin-right: 20px;">
            Explanation: <b>${predictionData.explanation}</b>
        </p>`;

    predictionDetails.innerHTML = probabilityHtml + spoilerHtml + explanationHtml;
}

// check in the chrome storage if this page was previously analyzed
chrome.storage.local.get([sourceUrl]).then((result) => {
    const predictionData = result[sourceUrl];
    if (typeof predictionData !== 'undefined') {
        setPredictionInfo(predictionData);
        new Detector().setBadge(predictionData, activeTab.id);
    }
});

// button action
document.getElementById('checkButton').addEventListener('click', async () => {
    document.getElementById('responseContent').textContent = "Analyzing...";
    // set up message listener
    chrome.runtime.onMessage.addListener(function(message) {
        if (message.action === 'sendContent') {
            setPredictionInfo(message.content);
            console.log(`UWAG UWAGA UWAGA ${activeTab.id}`)
            new Detector().setBadge(message.content, activeTab.id);
        }
    });
    // execute script in the active tab
    chrome.scripting.executeScript({
        target: {tabId: activeTab.id},
        files: ['prediction.js']
    });
});

// options button
document.getElementById('optionsButton').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('templates/options.html'));
    }
  });