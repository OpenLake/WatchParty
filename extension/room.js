var socket = io.connect('http://localhost:4000')
// const { pauseVideo } = import('./utils')

const username = document.getElementById('username')
const roomID = document.getElementById('roomID')
const button = document.getElementById('joinButton')
const output = document.getElementById('output')

const pauseButton = document.getElementById('pauseButton')
const syncButton = document.getElementById('syncButton')

function pauseVideo(){
    var videoElements = document.querySelectorAll('video');
    for (i = 0; i < videoElements.length; i++) {
        videoElements[i].pause();
    }
}

chrome.runtime.sendMessage({event:'checkAlive',data:null})

button.addEventListener('click', () => {
    // socket.emit('joinRoom',{
    //     username:username.value,
    //     roomID:roomID.value
    // })

    chrome.runtime.sendMessage({event:"joinRoom",data:{username:username.value,roomID:roomID.value}});

    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //     chrome.scripting.executeScript({
    //       target: {tabId: tabs[0].id},
    //       function: pauseVideo
    //     });
    // })

    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //     chrome.tabs.executeScript(tabs[0].id,{file:'content.js'});
    // })

    
})

pauseButton.addEventListener('click',() => {
    chrome.tabs.executeScript(null,{file:"./pause.js"});
    chrome.runtime.sendMessage({event:"pause",data:''});
})

syncButton.addEventListener('click',() => {
    chrome.tabs.executeScript(null,{file:"./getDuration.js"},(duration) => {
        chrome.runtime.sendMessage({event:'syncVideo',data:duration})
    });

})

// socket.on('joinRoom',(data) =>{
//     output.innerHTML = `<p>${data}</p>`
// })


// socket.on('leftRoom',(data) => {
//     output.innerHTML = `<p>${data}</p>`
// })

// socket.on('hostName',(data) => {
//     output.innerHTML += `<br><p>You're the Host</p>`
// })

chrome.runtime.onMessage.addListener(function(message, sender, senderResponse){
    if (message.event === "joinRoom"){
        output.innerHTML = message.data
    }else if (message.event === "leftRoom"){
        output.innerHTML += message.data
    }else if (message.event === "checkAlive"){
        output.innerHTML = message.data
    }
    // This should happen not just when popup is open but also in background
    // else if (message.event === "pause"){
    //     chrome.tabs.executeScript(null,{file:"./pause.js"});
    // }
})
