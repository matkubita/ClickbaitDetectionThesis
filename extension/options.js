// saves post click detection options to chrome sync storage
document.getElementById('saveButton').addEventListener('click', () => {
    
    const postDetectionType = document.querySelector('input[name="postDetection"]:checked').value;
  
    chrome.storage.sync.set(
      { postDetectionType:  postDetectionType},
      () => {
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 750);
      }
    );
  });

// saves pre click detection options to sync storage
document.getElementById("searchEngineDetection").addEventListener('change', (event) => {
  const searchEngineDetection = event.target.checked;
  if (searchEngineDetection) {
    console.log("Checkbox is checked..");
  } else {
    console.log("Checkbox is not checked..");
  }

  chrome.storage.sync.set(
    { searchEngineDetection: searchEngineDetection},
    () => {console.log("Pre-click detection options saved");}
  );
});

// sets monitored sites from storage
async function setMonitoredSites() {
  chrome.storage.sync.get(["monitoredSites"]).then((result) => {
    const monitoredSites = result['monitoredSites'];
    const htmlList = document.getElementById("monitoredSitesList");
    
    for (let i = 0; i < monitoredSites.length; i++) {
      const urlItem = document.createElement('li');
      urlItem.setAttribute('class', 'monitoredUrl');
      let webUrl = monitoredSites[i];
      if (webUrl.startsWith("https://")) {
        webUrl = webUrl.substring(8);
      } else if (webUrl.startsWith("http://")) {
        webUrl = webUrl.substring(7);
      }
      urlItem.textContent = webUrl;
      htmlList.appendChild(urlItem);
    }
  });
}

// add monitored site to storage
document.getElementById('addButton').addEventListener('click', () => {
  let newWebsite = document.getElementById("monitoredSitesInput").value;

  if (!newWebsite.startsWith("http")) {
    newWebsite = "https://".concat(newWebsite);
  }

  chrome.storage.sync.get(["monitoredSites"]).then((result) => {
    const monitoredSites = result['monitoredSites'];
    monitoredSites.push(newWebsite);
    chrome.storage.sync.set({"monitoredSites": monitoredSites});
  });

  // TODO append to array ?
  // setmonitoredSites(); - reloads automatically?
});

// Restores select box and checkbox state using the preferences stored in chrome.storage.
document.addEventListener('DOMContentLoaded', () => {
  
  // set post detection radio button
  chrome.storage.sync.get(["postDetectionType"]).then((result) => {
    const postDetectionType = result["postDetectionType"];
    document.getElementById(postDetectionType.concat("Detection")).checked = "checked"
  });

  // set pre click detection toggle
  chrome.storage.sync.get(["searchEngineDetection"]).then((result) => {
    const searchEngineDetection = result["searchEngineDetection"];
    console.log("searchEngineDetection", searchEngineDetection);
    if (searchEngineDetection) {
      document.getElementById("searchEngineDetection").checked = true;
    } else {
      document.getElementById("searchEngineDetection").checked = false;
    }
  });

  // set monitored sites list
  setMonitoredSites();

});
  
  

