chrome.contextMenus.onClicked.addListener(onClick);

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        title: 'get headline',
        contexts: ['link'],
        id: 'getHeadline'
    });
});

function onClick(info, tab) {
    if (info.menuItemId !== 'getHeadline') {
        return;
    }
    (fetch(info.linkUrl)
        .then((response) => response.text())
        .then(async (html) => {
            const response = await chrome.tabs.sendMessage(tab.id, {html});
            console.log(response.content);
        }))
}