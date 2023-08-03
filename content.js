chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.html) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(request.html, 'text/html');

        // Now you can access the DOM of the fetched page
        // For example, get the title:
        let title = doc.title;
        console.log(title);
    }
});