import {DomService} from "./services/content-services/dom-service";
import {SiteSpecificService} from "./services/site-specific-service";
const domService = new DomService(new DOMParser(), document);


chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: any) => {
  if (request.html) {
    const content = domService.parseContent(request.html);
    sendResponse({content});
  }
});
var clickedEl: any = null;


document.addEventListener("contextmenu", function(event) {
  clickedEl = event.target;
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.content) {
    if (!SiteSpecificService.handlePageSpecificInjection(request.content, clickedEl)) {
      domService.findParentLink(clickedEl).textContent = request.content;
    }
  }
});

