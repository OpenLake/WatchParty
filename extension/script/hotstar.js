var pause_play = document.getElementsByClassName(
    "player-icon player-control pause"
  )[0];
  var progress_bar = document.getElementsByClassName("slider-wrapper")[0];
  
  pause_play.addEventListener("click", () => {
    var videoElements = document.querySelectorAll("video")[0];
    chrome.runtime.sendMessage({
      event: "syncHotstar",
      data: [videoElements.currentTime, videoElements.paused],
    });
  });
  
  progress_bar.addEventListener("click", () => {
    var videoElements = document.querySelectorAll("video")[0];
    chrome.runtime.sendMessage({
      event: "syncHotstar",
      data: [videoElements.currentTime, videoElements.paused],
    });
  });
  