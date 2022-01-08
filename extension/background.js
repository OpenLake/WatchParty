var socket = io.connect('http://localhost:4000')

// chrome.runtime.onMessage.addListener(messageReceived);

var existingConnection = false;
var userData = {}

var user_list = {}

chrome.runtime.onMessage.addListener(function(message, sender, senderResponse){

    if (message.event === "joinRoom"){
        existingConnection = true;
        userData = {
            username:message.data.username,
            roomID:message.data.roomID
        }
        socket.emit('joinRoom',userData)
    
    }else if (message.event === "checkAlive"){
        if (existingConnection){
            // chrome.runtime.sendMessage({event:"checkAlive",data:`Welcome back ${userData.username}`})
            chrome.runtime.sendMessage({event:"checkAlive",data:{userData:userData,users:user_list}})
        }else{
            chrome.runtime.sendMessage({event:"checkAlive",data:''})
        }

    // }else if (message.event === "pause"){
    //     socket.emit('pause',userData)

    }else if (message.event === "syncVideo"){
        socket.emit('syncVideo',[userData,message.data])
    }
})


socket.on('joinRoom',(users) =>{
    // userData.dispData += data;
    chrome.runtime.sendMessage({event:'joinRoom',data:{userData:userData,users:users}});
    user_list = users
})



socket.on('leftRoom',(data) => {
    chrome.runtime.sendMessage({event:'leftRoom',data:data});
})

// socket.on('pause',(data) => {
//     // chrome.runtime.sendMessage({event:'pause',data:''});
//     chrome.tabs.executeScript(null,{file:"./pause.js"});
// })


socket.on('syncVideo',(data) => {
    duration = data[0]
    isPaused = data[1]
    chrome.tabs.executeScript(null,{code:`var videoElements = document.querySelectorAll('video')[0]; videoElements.currentTime = ${duration}`})
    if (isPaused){
        chrome.tabs.executeScript(null,{code:`var videoElements = document.querySelectorAll('video')[0]; videoElements.pause()`})
    }else{
        chrome.tabs.executeScript(null,{code:`var videoElements = document.querySelectorAll('video')[0]; videoElements.play()`})
    }
        
    // chrome.tabs.executeScript(null,{file:'./setDuration.js'})
})

// socket.on('hostName',(data) => {
//     output.innerHTML += `<br><p>You're the Host</p>`
// })

