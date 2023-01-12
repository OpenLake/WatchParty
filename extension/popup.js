//Adding callback to avoid browser inbuild popup blocker

function make_popup() {
  window.open(
    chrome.runtime.getURL("popup.html"),
    "gc-popout-window",
    "width=400,height=400"
  );
  console.log("new popup window created");
}
setTimeout(make_popup, 5*1000);
console.log("call back fired");
