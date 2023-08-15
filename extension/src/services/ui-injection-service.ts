export class UiInjectionService {
    private static setCursorWaiting() {
        document.body.style.cursor = "wait";

    }

    public static startCursorWaiting(id: any) {
        chrome.scripting.executeScript({
            target: {tabId: id},
            func: this.setCursorWaiting,
        });
    }

    private static unsetCursorWaiting() {
        document.body.style.cursor = "";
    }

    public static stopCursorWaiting(id: any) {
        chrome.scripting.executeScript({
            target: {tabId: id},
            func: this.unsetCursorWaiting,
        });
    }

}
