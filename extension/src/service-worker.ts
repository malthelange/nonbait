import {FirestoreService} from "./services/firestore-service";

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";

function queryOpenAI(promptText: any, callback: any) {
  getApiKey((apiKey: any) => {
    fetch(OPENAI_ENDPOINT, {
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
    })
      .then(response => response.json())
      .then(data => {
        if (data.choices && data.choices.length > 0) {
          callback(null, data.choices[0].message.content);
        } else {
          callback("No completion found.");
        }
      })
      .catch(error => {
        callback(error.toString());
      });
  });
}

chrome.contextMenus.onClicked.addListener(onClick);
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    title: "get headline",
    contexts: ["link"],
    id: "getHeadline",
  });
});

const prePromt = "can you provide a long headline which summarizes all the most essential information in the following article? Please provide the headline in danish\n";

function processLink(linkUrl: any) {
  if (isFacebookRedirectLink(linkUrl)) {
    return extractOriginalURLFromFacebook(linkUrl);
  } else {
    return linkUrl;
  }
}

function extractOriginalURLFromFacebook(facebookURL: any) {
  // Parse the URL to get query parameters
  let url = new URL(facebookURL);

  // Extract the 'u' parameter and decode it
  let originalURL = url.searchParams.get("u");
  if (originalURL) {
    return decodeURIComponent(originalURL);
  } else {
    return null; // 'u' parameter not found
  }
}

function isFacebookRedirectLink(link: any) {
  try {
    let url = new URL(link);

    // Check if the host is 'l.facebook.com' and the path is '/l.php'
    if (url.hostname === "l.facebook.com" && url.pathname === "/l.php") {
      // Ensure the 'u' query parameter exists
      return url.searchParams.has("u");
    }
  } catch (error) {
    // If there's an error parsing the link as a URL, it's not a valid link
    return false;
  }

  return false;
}

function setCursorWaiting() {
  document.body.style.cursor = "wait";
  console.log("test set");

}

function startCursorWaiting(id: any) {
  chrome.scripting.executeScript({
    target: {tabId: id},
    func: setCursorWaiting,
  });
}

function unsetCursorWaiting() {
  document.body.style.cursor = "";
  console.log("test unset");
}

function stopCursorWaiting(id: any) {
  chrome.scripting.executeScript({
    target: {tabId: id},
    func: unsetCursorWaiting,
  });
}

function onClick(info: any, tab: any) {
  if (info.menuItemId !== "getHeadline") {
    return;
  }
  startCursorWaiting(tab.id);
  const link = processLink(info.linkUrl);
  (fetch(link)
    .then((response) => response.text())
    .then(async (html) => {
      console.log(info.linkUrl);
      console.log(info.html);
      const response = await chrome.tabs.sendMessage(tab.id, {html});
      console.log(response.content);
      queryOpenAI(prePromt + response.content, (error: any, result: string) => {
        if (error) {
          console.error("Error:", error);
        } else {
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
        stopCursorWaiting(tab.id);
      });
    }));
}

function getApiKey(callback: any) {
  chrome.storage.local.get(["apiKey"], (result) => {
    callback(result.apiKey);
  });
}
