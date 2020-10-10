chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    return {
      redirectUrl: details.url.replace('users.php', 'userlist.php'),
    };
  },
  { urls: ['https://e3new.nctu.edu.tw/local/courseextension/users.php*'] },
  ['blocking'],
);

const desiredLocation: Map<number, string> = new Map();
chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    const path = new URL(details.url).pathname;
    if (
      details.statusCode === 303 &&
      path !== '/' &&
      !path.startsWith('/login') &&
      details.responseHeaders
    ) {
      for (const header of details.responseHeaders) {
        if (
          header.name === 'Location' &&
          header.value &&
          new URL(header.value).pathname === '/login/index.php'
        ) {
          desiredLocation.set(details.tabId, details.url);
        }
      }
    }
  },
  { urls: ['<all_urls>'], types: ['main_frame'] },
  ['responseHeaders'],
);

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (desiredLocation.has(details.tabId)) {
      const redirectUrl = desiredLocation.get(details.tabId);
      desiredLocation.delete(details.tabId);
      return { redirectUrl };
    }
    return {};
  },
  { urls: ['https://e3new.nctu.edu.tw/my/'] },
  ['blocking'],
);

chrome.cookies.onChanged.addListener((changeInfo) => {
  if (changeInfo.cookie.name === 'MoodleSession') {
    chrome.cookies.set({
      expirationDate: Math.floor(Date.now() / 1000) + 86400,
      name: changeInfo.cookie.name,
      path: changeInfo.cookie.path,
      url: 'https://e3new.nctu.edu.tw',
      value: changeInfo.cookie.value,
    });
  }
});
