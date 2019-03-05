chrome.webRequest.onBeforeRequest.addListener((details) => {
    return {
        redirectUrl: details.url.replace("users.php", "userlist.php"),
    };
}, { urls: ["https://e3new.nctu.edu.tw/local/courseextension/users.php*"] }, ["blocking"]);

let desiredLocation: Map<number, string> = new Map();
chrome.webRequest.onHeadersReceived.addListener((details) => {
    const path = new URL(details.url).pathname;
    if (details.statusCode === 303
        && path !== "/"
        && path !== "/login/index.php"
        && details.responseHeaders) {
        for (const header of details.responseHeaders) {
            if (header.name === "Location" && header.value &&
                new URL(header.value).pathname === "/login/index.php") {
                desiredLocation.set(details.tabId, details.url);
            }
        }
    }
}, { urls: ["<all_urls>"], types: ["main_frame"] }, ["responseHeaders"]);

chrome.webRequest.onBeforeRequest.addListener((details) => {
    if (desiredLocation.has(details.tabId)) {
        const redirectUrl = desiredLocation.get(details.tabId);
        desiredLocation.delete(details.tabId);
        return { redirectUrl };
    }
    return {};
}, { urls: ["https://e3new.nctu.edu.tw/my/"] }, ["blocking"]);
