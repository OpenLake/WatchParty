var videoElements = document.querySelectorAll('video')[0];

if (videoElements) {
  var videoData = [videoElements.currentTime, videoElements.paused];
  console.log("Video Data:", videoData);
} else {
  console.error("No video element found on the page");
}
