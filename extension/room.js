const username = document.getElementById('username')
const roomID = document.getElementById('roomID')
const button = document.getElementById('joinButton')
const output = document.getElementById('output')

const leaveButton = document.getElementById('leaveButton')
const usersButton = document.getElementById('usersButton')
const chatButton = document.getElementById('chatButton')
const sendButton = document.getElementById('sendButton')
const syncButton = document.getElementById('syncButton')

const chatBox = document.getElementById('chatBox')
const messageBox = document.getElementById('message')
const usersBox = document.getElementById('usersBox')
const innerChatBox = document.getElementById('innerChatBox')
const socketStatus = document.getElementById('socket_status')

var usersHTML = ''
var chatHTML = ''
chatBox.style.display = 'none'



// When the popup window is reopened
chrome.runtime.sendMessage({event:'checkAlive',data:null})



// Event listeners for buttons
button.addEventListener('click', () => {
    chrome.runtime.sendMessage({event:"joinRoom",data:{username:username.value,roomID:roomID.value}});
})

leaveButton.addEventListener('click',() => {
    chrome.runtime.sendMessage({event:'leaveRoom',data:''})
    output.innerHTML = ''
})

usersButton.addEventListener('click', () => {
    chatBox.style.display = 'none'
    usersBox.style.display = 'inline'
})

sendButton.addEventListener('click', () => {
    innerChatBox.innerHTML += `<p><b>You</b>: ${messageBox.value}</p>`
    chrome.runtime.sendMessage({event:"sendMessage",data:messageBox.value});
})

chatButton.addEventListener('click', () => {
    chatBox.style.display = 'inline'
    usersBox.style.display = 'none'
    innerChatBox.innerHTML = ''
    chrome.runtime.sendMessage({event:"fetchMessages",data:''});
})

syncButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({event:"setVideoState",data:''})
})


// Event listeners for the background.js script

chrome.runtime.onMessage.addListener(function(message, sender, senderResponse){

    if (message.event === "joinRoom" || message.event === "checkAlive"){

        userData = message.data.userData
        users = message.data.users

        usersBox.innerHTML = '<br><ul class="list-group">'
        for (i = 0; i < users.length; ++i){
            if (users[i].username === userData.username){
                usersBox.innerHTML += `<li class="list-group-item active">${users[i].username}</li>`
            }else{
                usersBox.innerHTML += `<li class="list-group-item">${users[i].username}</li>`
            }
        }
        usersBox.innerHTML += '</ul>'

        chrome.runtime.sendMessage({event:"setVideoState",data:''})

    }
    
    else if (message.event === "leaveRoom"){
        usersBox.innerHTML = '<br><ul class="list-group">'
        users = message.data
        for (i = 0; i < users.length; ++i){
            if (users[i].username === userData.username){
                usersBox.innerHTML += `<li class="list-group-item active">${users[i].username}</li>`
            }else{
                usersBox.innerHTML += `<li class="list-group-item">${users[i].username}</li>`
            }
            

        }
        usersBox.innerHTML += '</ul>'
    }

    else if (message.event === 'sendMessage'){
        var chatData = message.data
        innerChatBox.innerHTML = ''
        for (var i = 0; i < chatData.length; ++i){
            innerChatBox.innerHTML += `<p><b>${chatData[i].username}</b>: ${chatData[i].message}</p>`
        }

    }

    else if (message.event === "socketStatus"){
        if (message.data == true){
            socketStatus.innerHTML = '<span class="badge alert-success" style="display:inline">Connected to server</span>'
        }else{
            socketStatus.innerHTML = '<span class="badge alert-success" style="display:inline;color:red"> Not Connected to server</span>'
        }
    }

})
