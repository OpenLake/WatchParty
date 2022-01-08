function pauseVideo(){
    var videoElements = document.querySelectorAll('video');
    for (i = 0; i < videoElements.length; i++) {
        videoElements[i].pause();
    }
}

module.exports = {
    pauseVideo
}