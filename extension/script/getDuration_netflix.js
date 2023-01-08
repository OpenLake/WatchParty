const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;

// getting netflix player id
const playerSessionId = videoPlayer.getAllPlayerSessionIds()[0];

const player = videoPlayer.getVideoPlayerBySessionId(playerSessionId);

var videoElements = player;

[videoElements.currentTime, videoElements.paused];
