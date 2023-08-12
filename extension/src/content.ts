chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: any) => {
    if (request.html) {
        const content = parseContent(request.html);
        sendResponse({content});
    }
});
var clickedEl: any = null;

document.addEventListener("contextmenu", function(event){
    clickedEl = event.target;
}, true);

function isFacebookDomain() {
    const facebookDomains = ['facebook.com', 'fb.com', 'fb.me'];

    // Get current domain name
    let currentDomain = window.location.hostname;

    // Check if the current domain is a subdomain or the exact domain of Facebook
    return facebookDomains.some(domain => {
        return currentDomain === domain || currentDomain.endsWith('.' + domain);
    });
}

function handleFacebookSpecificInjection(content: any) {
    const span = findDeepestSpan(clickedEl);
    span.textContent = content;
}

function handlePageSpecificInjection(content: any) {
    if(isFacebookDomain()) {
        handleFacebookSpecificInjection(content);
        return true;
    }
    else {
        return false;
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.content) {
        if(!handlePageSpecificInjection(request.content)) {
            findParentLink(clickedEl).textContent = request.content;
        }
    }
});

function findParentLink(element: any) {
    while (element) {
        if (element.tagName === 'A') {
            return element;
        }
        element = element.parentElement;
    }
    return null;
}


function parseContent(htmlString: any) {
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
    // @ts-ignore
    for (let node of nodes) {
        if(!(node.localName.startsWith('p') && node.textContent.length < 20)){
            content.push(node.textContent);
        }
    }
    // Convert content array to a single string
    return content.join('\n');
}

function findDeepestSpan(node: any) {
    // Base cases
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    if (node.tagName.toLowerCase() === 'span' && !node.querySelector('span')) return node;

    // Recursively search children
    let deepestSpan = null;
    let maxDepth = -1;

    for (let child of node.children) {
        let result: any = findDeepestSpan(child);
        if (result) {
            let depth = getDepth(result, 0);
            if (depth > maxDepth) {
                maxDepth = depth;
                deepestSpan = result;
            }
        }
    }

    return deepestSpan;
}

function getDepth(node: any, depth: any): any {
    if (!node.parentElement || node.tagName.toLowerCase() === 'body') return depth;
    return getDepth(node.parentElement, depth + 1);
}
