/*
Netflix Player API
const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
const player = videoPlayer.getVideoPlayerBySessionId(videoPlayer.getAllPlayerSessionIds()[0]);
*/

var videoElements = document.querySelectorAll("video")[0];

if (videoElements) {
  var videoData = [videoElements.currentTime, videoElements.paused];
  console.log("Video Data:", videoData);
} else {
  console.error("No video element found on the page");
}
