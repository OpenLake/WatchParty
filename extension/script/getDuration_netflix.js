function getVideoPlayer() {
  let screen = window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
  let t = screen.getAllPlayerSessionIds().find((val) => val.includes("watch"));
  return screen.getVideoPlayerBySessionId(t);
}

var videoElements=getVideoPlayer();

[videoElements.getCurrentTime(), videoElements.isPaused()];
