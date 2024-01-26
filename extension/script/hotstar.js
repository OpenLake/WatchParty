var pause_play = document.getElementsByClassName("player-icon player-control pause")[0];
var progress_bar = document.getElementsByClassName("slider-wrapper")[0];

if (pause_play && progress_bar) {
  pause_play.addEventListener("click", () => {
    var videoElements = document.querySelector("video");
    if (videoElements) {
      chrome.runtime.sendMessage({
        event: "syncHotstar",
        data: [videoElements.currentTime, videoElements.paused],
      });
    } else {
      console.error("Video element not found");
    }
  });

  progress_bar.addEventListener("click", () => {
    var videoElements = document.querySelector("video");
    if (videoElements) {
      chrome.runtime.sendMessage({
        event: "syncHotstar",
        data: [videoElements.currentTime, videoElements.paused],
      });
    } else {
      console.error("Video element not found");
    }
  });
} else {
  console.error("pause_play or progress_bar element not found");
}
