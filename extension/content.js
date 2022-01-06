// var pauseButton = document.getElementsByClassName('ytp-play-button ytp-button')[0]

// pauseButton.addEventListener('click',() => {
//     alert('you preesed')
// })


// var pause = document.getElementsByClassName('hellodaf')[0]
var pause_play = document.getElementsByClassName('ytp-play-button ytp-button')[0]
var progress_bar = document.getElementsByClassName('ytp-progress-bar')[0]
// var pause = document.getElementById('123')
// var title = document.getElementsByClassName('title style-scope ytd-video-primary-info-renderer')[0]

// var text = document.getElementById('para')
// text.innerHTML = '<p>Hooafadfdf</p>'

pause_play.addEventListener('click',() => {
    var videoElements = document.querySelectorAll('video')[0];
    chrome.runtime.sendMessage({event:"syncVideo",data:[videoElements.currentTime,videoElements.paused]})
})

progress_bar.addEventListener('click',() => {
    var videoElements = document.querySelectorAll('video')[0];
    chrome.runtime.sendMessage({event:"syncVideo",data:[videoElements.currentTime,videoElements.paused]})
})

// document.body.style.background = 'yellow';