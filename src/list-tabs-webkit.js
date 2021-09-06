#!/usr/bin/env osascript -l JavaScript

const pangu = require('pangu');

function run(args) {
  let browser = args[0];
  if (!Application(browser).running()) {
    return JSON.stringify({
      items: [
        {
          title: `${browser} is not running`,
          subtitle: `Press enter to launch ${browser}`,
        },
      ],
    });
  }

  let chrome = Application(browser);
  chrome.includeStandardAdditions = true;
  let windowCount = chrome.windows.length;
  let tabsTitle = chrome.windows.tabs.name();
  let tabsUrl = chrome.windows.tabs.url();
  let tabsMap = {};

  for (let w = 0; w < windowCount; w++) {
    for (let t = 0; t < tabsTitle[w].length; t++) {
      let url = tabsUrl[w][t] || "";
      let matchUrl0 = url.replace(/(^\w+:|^)\/\//, "");
      let matchUrl1 = decodeURIComponent(matchUrl0)
      let matchUrl = matchUrl1.replace(/\W+/g, " ");
      let title0 = tabsTitle[w][t] || matchUrl;
      let title = pangu.spacing(title0)

      tabsMap[url] = {
        title,
        url,
        subtitle: url,
        windowIndex: w,
        tabIndex: t,
        arg: `${w},${url || title}`,
        quicklookurl: url,
        match: `${title} ${matchUrl}`,
      };
    }
  }

  let items = Object.keys(tabsMap).reduce((acc, url) => {
    acc.push(tabsMap[url]);
    return acc;
  }, []);

  return JSON.stringify({ items });
}
