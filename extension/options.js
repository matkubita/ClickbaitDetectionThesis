// saves options to chrome sync storage
document.getElementById('saveButton').addEventListener('click', () => {
    
    const recognitionType = document.querySelector('input[name="recognition"]:checked').value;
  
    chrome.storage.sync.set(
      { recognitionType:  recognitionType},
      () => {
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 750);
      }
    );
  });

// saves search engine options to sync storage
document.getElementById("searchEngineDetection").addEventListener('change', (event) => {
  const preDetection = event.target.checked;
  if (preDetection) {
    console.log("Checkbox is checked..");
  } else {
    console.log("Checkbox is not checked..");
  }

  chrome.storage.sync.set(
    { preDetection: preDetection},
    () => {console.log("Pre-click detection options saved");}
  );
});



async function setWhitelist() {
  chrome.storage.sync.get(["whitelist"]).then((result) => {
    const whitelist = result['whitelist'];
    const htmlList = document.getElementById("whitelistList");
    
    for (let i = 0; i < whitelist.length; i++) {
      const urlItem = document.createElement('li');
      urlItem.setAttribute('class', 'whiteUrl');
      let webUrl = whitelist[i];
      if (webUrl.startsWith("https://")) {
        webUrl = webUrl.substring(8);
      } else if (webUrl.startsWith("http://")) {
        webUrl = webUrl.substring(7);
      }
      urlItem.textContent = webUrl;
      htmlList.appendChild(urlItem);
  }
  // TODO function which sets whitelisted websites from sync storage
  });
}

document.getElementById('addButton').addEventListener('click', () => {
  let newWebsite = document.getElementById("whitelistInput").value;
  // TODO set to sync storage, append to array

  if (!newWebsite.startsWith("http")) {
    newWebsite = "https://".concat(newWebsite);
  }

  chrome.storage.sync.get(["whitelist"]).then((result) => {
    const whitelist = result['whitelist'];
    whitelist.push(newWebsite);
    chrome.storage.sync.set({"whitelist": whitelist});
  });

  // setWhitelist();
});

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(["recognitionType"]).then((result) => {
    const recognitionType = result["recognitionType"];
    document.getElementById(recognitionType.concat("Recognition")).checked = "checked"
  });
  chrome.storage.sync.get(["preDetection"]).then((result) => {
    const preDetection = result["preDetection"];
    console.log("preDetection", preDetection);
    if (preDetection) {
      document.getElementById("searchEngineDetection").checked = true;
    } else {
      document.getElementById("searchEngineDetection").checked = false;
    }
    
  });
  setWhitelist();
});
  
  

