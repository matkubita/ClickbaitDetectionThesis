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
      let webUrl = monitoredSites[i];
      addSiteToList(htmlList, webUrl);
    }
  });
}

function deleteSite(listItem, webUrl) {
  // remove from html list
  listItem.remove();
  // remove from storage list
  chrome.storage.sync.get(["monitoredSites"]).then((result) => {
    const monitoredSites = result['monitoredSites'];
    const updatedSites = monitoredSites.filter(site => site !== webUrl);
    chrome.storage.sync.set({"monitoredSites": updatedSites});
  });
}

// adds site to list on options page
function addSiteToList(htmlList, webUrl) {

  const urlItem = document.createElement('li');
  urlItem.setAttribute('class', 'monitoredUrl');
  urlItem.textContent = webUrl;
  
  const smallText = document.createElement('small');
  smallText.textContent = "X";
  const deleteButton = document.createElement('button');
  deleteButton.appendChild(smallText);
  deleteButton.setAttribute('class', 'deleteButton btn btn-danger');
  deleteButton.addEventListener('click', () => {
    deleteSite(urlItem, webUrl);
  });

  urlItem.appendChild(deleteButton);
  htmlList.appendChild(urlItem);
}

// handle new monitored site (add to storage and HTML list)
document.getElementById('addButton').addEventListener('click', () => {
  let newWebsite = document.getElementById("monitoredSitesInput").value;

  if (!newWebsite.startsWith("http") || !newWebsite.startsWith("*")) {
    newWebsite = "*".concat(newWebsite);
  }
  // or always add * 

  chrome.storage.sync.get(["monitoredSites"]).then((result) => {
    const monitoredSites = result['monitoredSites'];
    monitoredSites.push(newWebsite);
    chrome.storage.sync.set({"monitoredSites": monitoredSites})
  });

  const htmlList = document.getElementById("monitoredSitesList");
  addSiteToList(htmlList, newWebsite);

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
  
  

