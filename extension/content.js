// This script gets injected when new tab is opened.

var pause_play = document.getElementsByClassName(
  "ytp-play-button ytp-button"
)[0];
var progress_bar = document.getElementsByClassName("ytp-progress-bar")[0];

pause_play.addEventListener("click", () => {
  var videoElements = document.querySelectorAll("video")[0];
  chrome.runtime.sendMessage({
    event: "syncVideo",
    data: [videoElements.currentTime, videoElements.paused],
  });
});

progress_bar.addEventListener("click", () => {
  var videoElements = document.querySelectorAll("video")[0];
  chrome.runtime.sendMessage({
    event: "syncVideo",
    data: [videoElements.currentTime, videoElements.paused],
  });
});

var s = document.createElement('script');
s.src = chrome.runtime.getURL('popup.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

console.log("content script injected");