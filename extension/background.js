var socket = io.connect('http://localhost:4000')

// chrome.runtime.onMessage.addListener(messageReceived);

function messageReceived(msg) {
   alert('hi')
}

var existingConnection = false;
var userData = {}
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
            chrome.runtime.sendMessage({event:"checkAlive",data:`Welcome back ${userData.username}`})
        }else{
            chrome.runtime.sendMessage({event:"checkAlive",data:'New Connection'})
        }

    }else if (message.event === "pause"){
        socket.emit('pause',userData)
    }
})


socket.on('joinRoom',(data) =>{
    chrome.runtime.sendMessage({event:'joinRoom',data:data});
})



socket.on('leftRoom',(data) => {
    chrome.runtime.sendMessage({event:'leftRoom',data:data});
})

socket.on('pause',(data) => {
    // chrome.runtime.sendMessage({event:'pause',data:''});
    chrome.tabs.executeScript(null,{file:"./pause.js"});
})

// socket.on('hostName',(data) => {
//     output.innerHTML += `<br><p>You're the Host</p>`
// })

