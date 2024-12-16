// SAVE BUTTON

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
    )
  });

// SAVING OPTIONS TO STORAGE

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
  )
});

document.getElementById("newsPortalDetection").addEventListener('change', (event) => {
  const newsPortalDetection = event.target.checked;
  if (newsPortalDetection) {
    console.log("Checkbox is checked..");
  } else {
    console.log("Checkbox is not checked..");
  }

  chrome.storage.sync.set(
    { newsPortalDetection: newsPortalDetection},
    () => {console.log("Pre-click detection options saved");}
  )
});

// saves spoiler generation option to storage
document.getElementById("spoilerGeneration").addEventListener('change', (event) => {
  const spoilerGeneration = event.target.checked;
  if (spoilerGeneration) {
    console.log("Checkbox is checked..");
  } else {
    console.log("Checkbox is not checked..");
  }

  chrome.storage.sync.set(
    { spoilerGeneration: spoilerGeneration},
    () => {console.log("Pre-click detection options saved");}
  )
});

// MONITORED SITES HANDLERS

// sets monitored sites from storage
async function setMonitoredSites() {
  chrome.storage.sync.get(["monitoredSites"]).then((result) => {
    const monitoredSites = result['monitoredSites'];
    const htmlList = document.getElementById("monitoredSitesList");
    
    for (let i = 0; i < monitoredSites.length; i++) {
      let webUrl = monitoredSites[i];
      addSiteToList(htmlList, webUrl);
    }
  }).catch((error) => {console.error(error)});
}

// deletes site from monitored sites list
function deleteSite(listItem, webUrl) {
  // remove from html list
  listItem.remove();
  // remove from storage list
  chrome.storage.sync.get(["monitoredSites"]).then((result) => {
    const monitoredSites = result['monitoredSites'];
    const updatedSites = monitoredSites.filter(site => site !== webUrl);
    chrome.storage.sync.set({"monitoredSites": updatedSites});
  }).catch((error) => {console.error(error)});
}

// adds site to list on options page
function addSiteToList(htmlList, webUrl) {

  const urlItem = document.createElement('li');
  urlItem.setAttribute('class', 'monitoredUrl');
  urlItem.textContent = webUrl;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = "x";
  deleteButton.setAttribute('class', 'deleteButton btn');
  deleteButton.addEventListener('click', () => {
    deleteSite(urlItem, webUrl);
  });

  urlItem.appendChild(deleteButton);
  htmlList.appendChild(urlItem);
}

// ADD BUTTON

// handle new monitored site (add to storage and HTML list)
document.getElementById('addButton').addEventListener('click', () => {
  let newWebsite = document.getElementById("monitoredSitesInput").value;

  if (!newWebsite.startsWith("http") && !newWebsite.startsWith("*")) {
    newWebsite = "*".concat(newWebsite);
  }

  chrome.storage.sync.get(["monitoredSites"]).then((result) => {
    const monitoredSites = result['monitoredSites'];
    monitoredSites.push(newWebsite);
    chrome.storage.sync.set({"monitoredSites": monitoredSites});
  }).catch((error) => {console.error(error)});

  const htmlList = document.getElementById("monitoredSitesList");
  addSiteToList(htmlList, newWebsite);

});

monitoredSitesInput.addEventListener("keypress", function(event) {
  const addButton = document.getElementById("addButton");
  if (event.key === "Enter") {
      event.preventDefault(); 
      addButton.click();
  }
});

// SET DEFAULTS

// Restores select box and checkbox state using the preferences stored in chrome.storage.
document.addEventListener('DOMContentLoaded', () => {
  
  // set post detection radio button
  chrome.storage.sync.get(["postDetectionType"]).then((result) => {
    const postDetectionType = result["postDetectionType"];
    document.getElementById(postDetectionType.concat("Detection")).checked = "checked"
  }).catch((error) => {console.error(error)});

  // set pre click detection serach engine toggle
  chrome.storage.sync.get(["searchEngineDetection"]).then((result) => {
    const searchEngineDetection = result["searchEngineDetection"];
    console.log("searchEngineDetection", searchEngineDetection);
    if (searchEngineDetection) {
      document.getElementById("searchEngineDetection").checked = true;
    } else {
      document.getElementById("searchEngineDetection").checked = false;
    }
  }).catch((error) => {console.error(error)});

  // set pre click detection news portal toggle
  chrome.storage.sync.get(["newsPortalDetection"]).then((result) => {
    const newsPortalDetection = result["newsPortalDetection"];
    console.log("newsPortalDetection", newsPortalDetection);
    if (newsPortalDetection) {
      document.getElementById("newsPortalDetection").checked = true;
    } else {
      document.getElementById("newsPortalDetection").checked = false;
    }
  }).catch((error) => {console.error(error)});

  // set pre click detection news portal toggle
  chrome.storage.sync.get(["spoilerGeneration"]).then((result) => {
    const spoilerGeneration = result["spoilerGeneration"];
    console.log("spoilerGeneration", spoilerGeneration);
    if (spoilerGeneration) {
      document.getElementById("spoilerGeneration").checked = true;
    } else {
      document.getElementById("spoilerGeneration").checked = false;
    }
  }).catch((error) => {console.error(error)});

  // set monitored sites list
  setMonitoredSites();

});
  
  

