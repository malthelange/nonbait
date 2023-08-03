chrome.contextMenus.onClicked.addListener(onClick);

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        title: 'get headline',
        contexts: ['link'],
        id: 'getHeadline'
    });
});

function onClick(info) {
    if (info.menuItemId !== 'getHeadline') {
        return;
    }
    console.log(info.linkUrl);
    fetch(info.linkUrl)
        .then((response) => response.text())
        .then((html) => {
            chrome.tabs.sendMessage(tab.id, {html});
        });
}