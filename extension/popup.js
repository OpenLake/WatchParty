window.open(
  chrome.runtime.getURL("popup.html"),
  "gc-popout-window",
  "width=400,height=400"
);

console.log("new popup window created");