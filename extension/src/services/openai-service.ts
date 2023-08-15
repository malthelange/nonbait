export class OpenaiService {
    private static OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
    private static PRE_PROMPT = "can you provide a long headline which summarizes all the most essential information in the following article? Please provide the headline in danish\n";

    private static getApiKey(callback: any) {
        chrome.storage.local.get(["apiKey"], (result) => {
            callback(result.apiKey);
        });
    }

    public static queryOpenAIForHeadline(promptText: any, callback: any) {
        return OpenaiService.queryOpenAI(OpenaiService.PRE_PROMPT + promptText, callback);
    }

    private static queryOpenAI(promptText: any, callback: any) {
        OpenaiService.getApiKey((apiKey: any) => {
            this.sendRequest(apiKey, promptText)
                .then(response => response.json())
                .then((data) => this.handleResponseData(data, callback))
                .catch(error => {
                    callback(error.toString());
                });
        });
    }

    private static handleResponseData(data: any, callback: any) {
        if (data.choices && data.choices.length > 0) {
            callback(null, data.choices[0].message.content);
        } else {
            callback("No completion found.");
        }
    }

    private static sendRequest(apiKey: any, promptText: any) {
        return fetch(OpenaiService.OPENAI_ENDPOINT, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    "content": promptText,
                }],
                max_tokens: 200,
            }),
        });
    }
}
