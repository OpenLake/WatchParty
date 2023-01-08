const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;

// getting netflix player id
const playerSessionId = videoPlayer.getAllPlayerSessionIds()[0];

const player = videoPlayer.getVideoPlayerBySessionId(playerSessionId);

var pause_play = player.paused;
var progress_bar = player.currentTime;

pause_play.addEventListener("click", () => {
  var videoElements = player;
  chrome.runtime.sendMessage({
    event: "syncVideo",
    data: [videoElements.currentTime, videoElements.paused],
  });
});

progress_bar.addEventListener("click", () => {
  var videoElements = player;
  chrome.runtime.sendMessage({
    event: "syncVideo",
    data: [videoElements.currentTime, videoElements.paused],
  });
});
