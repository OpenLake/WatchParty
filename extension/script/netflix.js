// Netflix player API

var bottom_control = document.getElementsByClassName("player-control-button player-play-pause")[0];

if (bottom_control) {
  bottom_control.addEventListener("click", () => {
    var videoElements = document.querySelector("video");
    if (videoElements) {
      chrome.runtime.sendMessage({
        event: "syncNetflix",
        data: [videoElements.currentTime, videoElements.paused],
      });
    } else {
      console.error("Video element not found");
    }
  });
} else {
  console.error("bottom_control element not found");
}
