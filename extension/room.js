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
    if (message.event === "joinRoom" || message.event === "checkAlive"){

        userData = message.data.userData
        users = message.data.users
        output.innerHTML = `<p>Hello, <b>${userData.username}</b></p><br>`

        output.innerHTML += `<p>Users in party: </p>`
        // output.innerHTML += `<p>${JSON.stringify(users)}</p>`
        for (i = 0; i < users.length; ++i){
            output.innerHTML += `<p>${users[i].username}</p><br>`
        }

    }else if (message.event === "leftRoom"){
        output.innerHTML += message.data
    }

})
