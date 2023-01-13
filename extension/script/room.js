const username = document.getElementById('username')
const roomID = document.getElementById('roomID')
const button = document.getElementById('joinButton')
const output = document.getElementById('output')
const leaveButton = document.getElementById('leaveButton')
const usersButton = document.getElementById('usersButton')
const chatButton = document.getElementById('chatButton')
const sendButton = document.getElementById('sendButton')

var usersHTML = ''
var chatHTML = ''
var chatboxshow =0;
const chatBox = document.getElementById('chatBox')
chatBox.style.display = 'none'
const messageBox = document.getElementById('message')

const usersBox = document.getElementById('usersBox')


const innerChatBox = document.getElementById('innerChatBox')

const syncButton = document.getElementById('syncButton')

const socketStatus = document.getElementById('socket_status')



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
    innerChatBox.style.color = 'white'
    if(messageBox.value!=""){
        innerChatBox.innerHTML += `<p><b>You</b>: ${messageBox.value}</p>`
        chrome.runtime.sendMessage({event:"sendMessage",data:messageBox.value});
        messageBox.value="";
    }
})

chatButton.addEventListener('click', () => {
if (chatboxshow === 0){
    chatBox.style.display = 'inline'
    usersBox.style.display = 'none'
    innerChatBox.innerHTML = ''
    chrome.runtime.sendMessage({event:"fetchMessages",data:''});
    chatboxshow=1;
    }else{
    chatBox.style.display = 'none'
    usersBox.style.display = 'inline'
    chatboxshow=0;
    }
})

syncButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({event:"setVideoStateYoutube",data:''});
    chrome.runtime.sendMessage({event:"setVideoStateNetflix",data:''});
    chrome.runtime.sendMessage({event:"setVideoStateHotstar",data:''});
})


// Event listeners from the background.js script

chrome.runtime.onMessage.addListener(function(message, sender, senderResponse){

    if (message.event === "joinRoom" || message.event === "checkAlive"){

        userData = message.data.userData
        users = message.data.users

        usersBox.innerHTML = '<br><ul class="list-group">'
        for (i = 0; i < users.length; ++i){
            if (users[i].username === userData.username){
                usersBox.innerHTML += `<li class="list-group-item active"><span>${users[i].username}</span><span id="Host">H</span></li>`
            }else{
                usersBox.innerHTML += `<li class="list-group-item"><span>${users[i].username}</span><span id="Host">H</span></li>`
            }
        }
        usersBox.innerHTML += '</ul>'

        chrome.runtime.sendMessage({event:"setVideoStateYoutube",data:''})
        chrome.runtime.sendMessage({event:"setVideoStateNetflix",data:''})
        chrome.runtime.sendMessage({event:"setVideoStateHotstar",data:''})

    }
    
    else if (message.event === "leaveRoom"){
        usersBox.innerHTML = '<br><ul class="list-group">'
        users = message.data
        for (i = 0; i < users.length; ++i){
            if (users[i].username === userData.username){
                usersBox.innerHTML += `<li class="list-group-item active"><span>${users[i].username}</span><span id="Host">H</span></li>`
            }else{
                usersBox.innerHTML += `<li class="list-group-item"><span>${users[i].username}</span><span id="Host">H</span></li>`
            }
            

        }
        usersBox.innerHTML += '</ul>'
    }

    else if (message.event === 'sendMessage'){
        var chatData = message.data
        innerChatBox.style.color = 'white'
        innerChatBox.innerHTML = ''
        for (var i = 0; i < chatData.length; ++i){
            innerChatBox.innerHTML += `<p><b>${chatData[i].username}</b>: ${chatData[i].message}</p>`
        }

    }

 

    else if (message.event === "socketStatus"){
        if (message.data == true){
            socketStatus.innerHTML = '<button type="button" class="btn badge center1 btn-block glow-button btn-warning disable txt-black" > Connected to server</button>'
        }else{
            socketStatus.innerHTML = '<button type="button" class="btn badge center2 btn-block glow-button btn-warning disable txt-black" > Not Connected to server</button>'
        }
    }

})
