
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

  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  const restoreOptions = () => {
    chrome.storage.sync.get([recognitionType]).then((result) =>
      console.log(result)
    )
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
