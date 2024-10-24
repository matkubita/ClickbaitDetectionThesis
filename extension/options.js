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
// TODO  - add search engine detection option


async function setWhitelist() {
  chrome.storage.sync.get(["whitelist"]).then((result) => {
    const whitelist = result['whitelist'];
    const htmlList = document.getElementById("whitelistList");
    
    for (let i = 0; i < whitelist.length; i++) {
      const urlItem = document.createElement('li');
      urlItem.textContent = whitelist[i];
      htmlList.appendChild(urlItem);
  }
  // TODO function which sets whitelisted websites from sync storage
  });
}

document.getElementById('addButton').addEventListener('click', () => {
  const newWebsite = document.getElementById("whitelistInput").value;
  // TODO set to sync storage, append to array

  chrome.storage.sync.get(["whitelist"]).then((result) => {
    const whitelist = result['whitelist'];
    whitelist.push(newWebsite);
    chrome.storage.sync.set({"whitelist": whitelist});
  });

  setWhitelist();
});

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(["recognitionType"]).then((result) => {
    const recognitionType = result["recognitionType"];
    document.getElementById(recognitionType.concat("Recognition")).checked = "checked"
  });
  setWhitelist();
});
  
  

