chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.html) {
        const content = parseContent(request.html);
        sendResponse({content});
    }
});
var clickedEl = null;

document.addEventListener("contextmenu", function(event){
    clickedEl = event.target;
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.content) {
        findParentLink(clickedEl).textContent = request.content;
    }
});

function findParentLink(element) {
    while (element) {
        if (element.tagName === 'A') {
            return element;
        }
        element = element.parentElement;
    }
    return null;
}


function parseContent(htmlString) {
    // Parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Extract title from the <title> tag
    const title = doc.title;

    // Extract content
    let content = [];
    content.push(title);  // Starting with the title

    // Extract and add headlines from h1 to h6 and paragraphs
    const nodes = doc.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
    for (let node of nodes) {
        if(!(node.localName.startsWith('p') && node.textContent.length < 20)){
            content.push(node.textContent);
        }
    }
    // Convert content array to a single string
    return content.join('\n');
}