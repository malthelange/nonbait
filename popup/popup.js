document.getElementById('saveButton').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value;
    chrome.storage.local.set({ 'apiKey': apiKey }, () => {
        alert('API Key Saved!');
    });
});

