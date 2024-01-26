const username = document.getElementById("username");
const roomID = document.getElementById("roomID");
const button = document.getElementById("joinButton");
const output = document.getElementById("output");
const leaveButton = document.getElementById("leaveButton");
const usersButton = document.getElementById("usersButton");
const chatButton = document.getElementById("chatButton");
const sendButton = document.getElementById("sendButton");
const micButton = document.getElementById("micButton");
const stopButton = document.getElementById("stopButton");

var usersHTML = "";
var chatHTML = "";
var chatboxshow = 0;

const chatBox = document.getElementById("chatBox");
chatBox.style.display = "none";
const messageBox = document.getElementById("message");

const usersBox = document.getElementById("usersBox");

const innerChatBox = document.getElementById("innerChatBox");

const syncButton = document.getElementById("syncButton");

const socketStatus = document.getElementById("socket_status");

chrome.runtime.sendMessage({ event: "checkAlive", data: null });

micButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ event: "startRecording" });
});

stopButton.addEventListener('click',()=>{
  chrome.runtime.sendMessage({event : 'stopRecording'});
}); 

// Event listeners for popup buttons.
button.addEventListener("click", () => {
  console.log("JoinRoom Event triggered from Rooms.js ");
  // alert('joinRoom clicked') ;

  chrome.runtime.sendMessage({
    event: "joinRoom",
    data: { username: username.value, roomID: roomID.value },
  });
});

leaveButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ event: "leaveRoom", data: "" });
  output.innerHTML = "";
});

usersButton.addEventListener("click", () => {
  chatBox.style.display = "none";
  usersBox.style.display = "inline";
});

sendButton.addEventListener("click", () => {
  innerChatBox.style.color = "white";
  if (messageBox.value != "") {
    innerChatBox.innerHTML += `<p><b>You</b>: ${messageBox.value}</p>`;
    chrome.runtime.sendMessage({
      event: "sendMessage",
      data: messageBox.value,
    });
    messageBox.value = "";
  }
});

chatButton.addEventListener("click", () => {
  if (chatboxshow === 0) {
    chatBox.style.display = "inline";
    usersBox.style.display = "none";
    innerChatBox.innerHTML = "";
    chrome.runtime.sendMessage({ event: "fetchMessages", data: "" });
    chatboxshow = 1;
  } else {
    chatBox.style.display = "none";
    usersBox.style.display = "inline";
    chatboxshow = 0;
  }
});

syncButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ event: "setVideoStateYoutube", data: "" });
  chrome.runtime.sendMessage({ event: "setVideoStateNetflix", data: "" });
  chrome.runtime.sendMessage({ event: "setVideoStateHotstar", data: "" });
});

// Event listeners from the background script
chrome.runtime.onMessage.addListener(function (
  message,
  sender,
  senderResponse
) {
  if (message.event === "joinRoom") {
    console.log("received joinRoom in room.js from bg.js line 88");

    userData = message.data.userData;
    users = message.data.users || [];
    currHostName = message.data.currHostName;

    console.log("userData - ", userData);

    usersBox.innerHTML = '<br><ul class="list-group">';
    for (i = 0; i < users.length; ++i) {
      if (
        userData &&
        users[i].username === userData.username &&
        users[i].username === currHostName
      ) {
        usersBox.innerHTML += `<li class="list-group-item active"><span>${users[i].username}</span><span id="Host">HOST</span></li>`;
      } else if (users[i].username === userData.username) {
        usersBox.innerHTML += `<li class="list-group-item active"><span>${users[i].username}</span><span></span></li>`;
      } else if (users[i].username === currHostName) {
        usersBox.innerHTML += `<li class="list-group-item"><span>${users[i].username}</span><span id="Host">HOST</span></li>`;
      } else {
        usersBox.innerHTML += `<li class="list-group-item"><span>${users[i].username}</span><span></span></li>`;
      }
    }
    usersBox.innerHTML += "</ul>";

    chrome.runtime.sendMessage({ event: "setVideoStateYoutube", data: "" });
    chrome.runtime.sendMessage({ event: "setVideoStateNetflix", data: "" });
    chrome.runtime.sendMessage({ event: "setVideoStateHotstar", data: "" });
  } else if (message.event === "checkAlive") {
    if (message && message.data) {
      userData = message.data.userData || null;
      console.log("userdata from room.js line 119 ", userData);
    }
    users = message.data.users || [];
    currHostName = message.data.currHostName;

    console.log("check alive");

    usersBox.innerHTML = '<br><ul class="list-group">';
    for (i = 0; i < users.length; ++i) {
      if (
        userData &&
        users[i].username === userData.username &&
        users[i].username === currHostName
      ) {
        usersBox.innerHTML += `<li class="list-group-item active"><span>${users[i].username}</span><span id="Host">HOST</span></li>`;
      } else if (users[i].username === userData.username) {
        usersBox.innerHTML += `<li class="list-group-item active"><span>${users[i].username}</span><span></span></li>`;
      } else if (users[i].username === currHostName) {
        usersBox.innerHTML += `<li class="list-group-item"><span>${users[i].username}</span><span id="Host">HOST</span></li>`;
      } else {
        usersBox.innerHTML += `<li class="list-group-item"><span>${users[i].username}</span><span></span></li>`;
      }
    }
    usersBox.innerHTML += "</ul>";

    chrome.runtime.sendMessage({ event: "setVideoStateYoutube", data: "" });
    chrome.runtime.sendMessage({ event: "setVideoStateNetflix", data: "" });
    chrome.runtime.sendMessage({ event: "setVideoStateHotstar", data: "" });
  } else if (message.event === "leaveRoom") {
    userData = message.data.userData;
    users = message.data.users || [];
    currHostName = message.data.currHostName;

    console.log("leave room");

    usersBox.innerHTML = '<br><ul class="list-group">';
    for (i = 0; i < users.length; ++i) {
      if (
        users[i].username === userData.username &&
        users[i].username === currHostName
      ) {
        usersBox.innerHTML += `<li class="list-group-item active"><span>${users[i].username}</span><span id="Host">HOST</span></li>`;
      } else if (users[i].username === userData.username) {
        usersBox.innerHTML += `<li class="list-group-item active"><span>${users[i].username}</span><span></span></li>`;
      } else if (users[i].username === currHostName) {
        usersBox.innerHTML += `<li class="list-group-item"><span>${users[i].username}</span><span id="Host">HOST</span></li>`;
      } else {
        usersBox.innerHTML += `<li class="list-group-item"><span>${users[i].username}</span><span></span></li>`;
      }
    }
    usersBox.innerHTML += "</ul>";
  } else if (message.event === "sendMessage") {
    var chatData = message.data;
    innerChatBox.style.color = "white";
    innerChatBox.innerHTML = "";
    for (var i = 0; i < chatData.length; ++i) {
      innerChatBox.innerHTML += `<p><b>${chatData[i].username}</b>: ${chatData[i].message}</p>`;
    }
  } else if (message.event === "socketStatus") {
    if (message.data == true) {
      socketStatus.innerHTML =
        '<button type="button" class="btn badge center1 btn-block glow-button btn-warning disable txt-black" > Connected to server</button>';
    } else {
      socketStatus.innerHTML =
        '<button type="button" class="btn badge center2 btn-block glow-button btn-warning disable txt-black" > Not Connected to server</button>';
    }
  }
});

//------------------------------------------------------------------------------------------------------


// let isRecording = false;
// micButton.addEventListener("click", function () {
//   if (!isRecording) {
//     chrome.runtime.sendMessage({
//       event: "startRecording",
//       data: { username: username.value, roomID: roomID.value },
//     });
//     micButton.textContent = "🔴 Stop";
//     isRecording = !isRecording;
//   } else {
//     chrome.runtime.sendMessage({
//       event: "stopRecording",
//       data: { username: username.value, roomID: roomID.value },
//     });
//     micButton.textContent = "🎙️ Mic";
//     isRecording = !isRecording;
//   }
// });


// function updateMicButton(eventTrigger) {
//   chrome.storage.local.get(["isRecording"], function (result) {
//     let isRecording = result.isRecording !== undefined ? result.isRecording : false;
//     console.log("isRecording " + isRecording);

//     if (isRecording) {
//       micButton.innerText = "Stop";
//       chrome.storage.local.set({ isRecording: false });

//       if(eventTrigger==true){
//       console.log('trigerring event stop recording');
//       chrome.runtime.sendMessage({event : 'stopRecording'});
//       }

//     } else {
//       micButton.innerText = "Start";
//       chrome.storage.local.set({ isRecording: true });

//       if(eventTrigger==true){
//         console.log('trigerring event start recording');
//       chrome.runtime.sendMessage({ event: "startRecording" });
//       }
//     }
//   });
// }
// updateMicButton(false);