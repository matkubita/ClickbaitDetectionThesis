

// Saves options to chrome.storage
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


// TODO function which sets whitelisted websites from sync storage

document.getElementById('addButton').addEventListener('click', () => {
  const newWebsite = document.getElementById("whitelistInput").value;
  // TODO set to sync storage, append to array
});

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(["recognitionType"]).then((result) => {
    const recognitionType = result["recognitionType"];
    document.getElementById(recognitionType.concat("Recognition")).checked = "checked"
  });
});
  
  

