export class UiInjectionService {
    private static setCursorWaiting() {
        document.body.style.cursor = "wait";
        console.log("test set");

    }

    public static startCursorWaiting(id: any) {
        chrome.scripting.executeScript({
            target: {tabId: id},
            func: this.setCursorWaiting,
        });
    }

    private static unsetCursorWaiting() {
        document.body.style.cursor = "";
        console.log("test unset");
    }

    public static stopCursorWaiting(id: any) {
        chrome.scripting.executeScript({
            target: {tabId: id},
            func: this.unsetCursorWaiting,
        });
    }

}
