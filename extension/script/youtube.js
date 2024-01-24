var pause_play = document.getElementsByClassName("ytp-play-button ytp-button")[0];
var progress_bar = document.getElementsByClassName("ytp-progress-bar")[0];

if (pause_play && progress_bar) {
  pause_play.addEventListener("click", () => {
    var videoElements = document.querySelectorAll("video")[0] ;
    if (videoElements.currentTime !== undefined && videoElements.paused !== undefined) {
      chrome.runtime.sendMessage({
        event: "syncYoutube",
        data: [videoElements.currentTime, videoElements.paused],
      });
    }
  });

  progress_bar.addEventListener("click", () => {
    var videoElements = document.querySelectorAll("video")[0] ;
    if (videoElements.currentTime !== undefined && videoElements.paused !== undefined) {
      chrome.runtime.sendMessage({
        event: "syncYoutube",
        data: [videoElements.currentTime, videoElements.paused],
      });
    }
  });
} else {
  console.error("pause_play or progress_bar element not found");
}
