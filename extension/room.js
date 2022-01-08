var socket = io.connect('http://localhost:4000')
// const { pauseVideo } = import('./utils')

const username = document.getElementById('username')
const roomID = document.getElementById('roomID')
const button = document.getElementById('joinButton')
const output = document.getElementById('output')

// const syncButton = document.getElementById('syncButton')


chrome.runtime.sendMessage({event:'checkAlive',data:null})

button.addEventListener('click', () => {

    chrome.runtime.sendMessage({event:"joinRoom",data:{username:username.value,roomID:roomID.value}});

    
})


// syncButton.addEventListener('click',() => {
//     chrome.tabs.executeScript(null,{file:"./getDuration.js"},(data) => {
//         chrome.runtime.sendMessage({event:'syncVideo',data:data})
//     });

// })



chrome.runtime.onMessage.addListener(function(message, sender, senderResponse){
    if (message.event === "joinRoom"){
        output.innerHTML = message.data
    }else if (message.event === "leftRoom"){
        output.innerHTML += message.data
    }else if (message.event === "checkAlive"){
        output.innerHTML = message.data
    }

})
