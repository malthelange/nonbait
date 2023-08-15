import {FirestoreService} from "./services/service-worker-services/firestore-service";
import {NonBaitService} from "./services/NonBaitService";

chrome.contextMenus.onClicked.addListener(NonBaitService.onClick);
chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        title: "get headline",
        contexts: ["link"],
        id: "getHeadline",
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== "contentMessage") {
        return;
    }
    FirestoreService.getHeadlines(message.data).then(
        (headlines) => {
            sendResponse(headlines);
        });
});
