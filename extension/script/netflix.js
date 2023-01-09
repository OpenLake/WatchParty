function getVideoPlayer() {
  let screen = window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
  let t = screen.getAllPlayerSessionIds().find((val) => val.includes("watch"));
  return screen.getVideoPlayerBySessionId(t);
}

const player = getVideoPlayer();

var pause_play = player.isPaused();
var progress_bar = player.getCurrentTime();

pause_play.addEventListener("click", () => {
  var videoElements = player;
  chrome.runtime.sendMessage({
    event: "syncVideo",
    data: [videoElements.getCurrentTime(), videoElements.isPaused()],
  });
});

progress_bar.addEventListener("click", () => {
  var videoElements = player;
  chrome.runtime.sendMessage({
    event: "syncVideo",
    data: [videoElements.currentTime(), videoElements.isPaused()],
  });
});
