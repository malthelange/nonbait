const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

function queryOpenAI(promptText, callback) {
    getApiKey((apiKey) => {
        fetch(OPENAI_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    "content": promptText
                }],
                max_tokens: 200
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.choices && data.choices.length > 0) {
                    callback(null, data.choices[0].message.content);
                } else {
                    callback('No completion found.');
                }
            })
            .catch(error => {
                callback(error.toString());
            });
    });
}

chrome.contextMenus.onClicked.addListener(onClick);
chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        title: 'get headline',
        contexts: ['link'],
        id: 'getHeadline'
    });
});

const prePromt = 'can you provide a long headline which summarizes all the most essential information in the following danish article? Please provide the headline in danish\n'

function onClick(info, tab) {
    if (info.menuItemId !== 'getHeadline') {
        return;
    }
    (fetch(info.linkUrl)
        .then((response) => response.text())
        .then(async (html) => {
            const response = await chrome.tabs.sendMessage(tab.id, {html});
            queryOpenAI(prePromt + response.content, (error, result) => {
                if (error) {
                    console.error('Error:', error);
                } else {
                    chrome.tabs.sendMessage(tab.id, {content: result});
                    console.log('Response:', result);
                }
            });
        }))
}

function getApiKey(callback) {
    chrome.storage.local.get(['apiKey'], (result) => {
        callback(result.apiKey);
    });
}
