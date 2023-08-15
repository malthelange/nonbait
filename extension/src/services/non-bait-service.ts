import {SiteSpecificService} from "./site-specific-service";
import {UiInjectionService} from "./ui-injection-service";
import {OpenaiService} from "./service-worker-services/openai-service";
import {FirestoreService} from "./service-worker-services/firestore-service";

export interface FireStoreHeadlineEntry {
    headline: string;
    link: string;
}

export class NonBaitService {
    public static onClick(info: any, tab: any) {
        if (info.menuItemId !== "getHeadline") {
            return;
        }
        const link = SiteSpecificService.processLink(info.linkUrl);
        if (link == null) {
            return;
        }

        FirestoreService.getHeadline(link).then(
            (result: FireStoreHeadlineEntry[]) => {
                if(result.length == 0) {
                    NonBaitService.getNewHeadlineAndRespondToContentScript(tab, link);
                    return;
                }
                const firstHeadlineSuggestion = result[0].headline;
                chrome.tabs.sendMessage(tab.id, {content: firstHeadlineSuggestion});
                UiInjectionService.stopCursorWaiting(tab.id);
            }
        )
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
        const response = await chrome.tabs.sendMessage(tab.id, {html});
        OpenaiService.queryOpenAIForHeadline(response.content, (error: any, result: string) => {
            if (error) {
            } else {
                NonBaitService.handleResponseFromOpenAI(tab, result, link);
            }
            UiInjectionService.stopCursorWaiting(tab.id);
        });
    }

    private static handleResponseFromOpenAI(tab: any, result: string, link: string) {
        chrome.tabs.sendMessage(tab.id, {content: result});
        FirestoreService.addHeadline(link, result);
    }
}
