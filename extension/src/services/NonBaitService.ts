import {SiteSpecificService} from "./site-specific-service";
import {UiInjectionService} from "./ui-injection-service";
import {OpenaiService} from "./openai-service";
import {FirestoreService} from "./firestore-service";

export class NonBaitService {
    public static onClick(info: any, tab: any) {
        if (info.menuItemId !== "getHeadline") {
            return;
        }
        const link = SiteSpecificService.processLink(info.linkUrl);
        if (link == null) {
            return;
        }
        NonBaitService.getNewHeadlineAndRespondToContentScript(tab, link);
    }

    private static getNewHeadlineAndRespondToContentScript(tab: any, link: string) {
        UiInjectionService.startCursorWaiting(tab.id);
        fetch(link)
            .then((response) => response.text())
            .then(async (html) => {
                await NonBaitService.handleResponseFromArticleSite(tab, html, link);
            });
    }

    private static async handleResponseFromArticleSite(tab: any, html: string, link: string) {
        console.log(link);
        console.log(html);
        const response = await chrome.tabs.sendMessage(tab.id, {html});
        console.log(response.content);
        OpenaiService.queryOpenAIForHeadline(response.content, (error: any, result: string) => {
            if (error) {
                console.error("Error:", error);
            } else {
                NonBaitService.handleResponseFromOpenAI(tab, result, link);
            }
            UiInjectionService.stopCursorWaiting(tab.id);
        });
    }

    private static handleResponseFromOpenAI(tab: any, result: string, link: string) {
        chrome.tabs.sendMessage(tab.id, {content: result});
        FirestoreService.addHeadline(link, result).then(
            () => {
                console.log("Headline added");
            },
            (error) => {
                console.error("Error:", error);
            },
        );
        console.log("Response:", result);
    }
}
