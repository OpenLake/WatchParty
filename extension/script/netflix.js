// Netflix player API

const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
const player = videoPlayer.getVideoPlayerBySessionId(
  videoPlayer.getAllPlayerSessionIds()[0]
);

const netflix_media = document.querySelectorAll('video')[0];

var pause_play = netflix_media.paused
var progress_bar = player.getCurrentTime();

pause_play.addEventListener("click", () => {
  var videoElements = netflix_media;
  chrome.runtime.sendMessage({
    event: "syncVideo",
    data: [player.getCurrentTime(), videoElements.paused],
  });
});

progress_bar.addEventListener("click", () => {
  var videoElements = netflix_media;
  chrome.runtime.sendMessage({
    event: "syncVideo",
    data: [player.getCurrentTime(), videoElements.paused],
  });
});

console.log("netflix");