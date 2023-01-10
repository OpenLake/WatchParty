//API for seeking in Netflix
const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
const player = videoPlayer.getVideoPlayerBySessionId(
  videoPlayer.getAllPlayerSessionIds()[0]
);
[player];
