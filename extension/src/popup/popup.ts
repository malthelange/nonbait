// @ts-ignore
document.getElementById('saveButton').addEventListener('click', () => {
    // @ts-ignore
    const apiKey = document.getElementById('apiKey').value;
    chrome.storage.local.set({ 'apiKey': apiKey }, () => {
        alert('API Key Saved!');
    });
});

