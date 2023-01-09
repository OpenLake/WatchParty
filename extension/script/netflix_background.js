// Background script for netflix

var socket = io.connect("http://localhost:4000");
//var socket = io.connect('https://watchpartyserver.herokuapp.com/')

var existingConnection = false;
var userData = {};
var user_list = {};
var chatData = [];

function checkStatus() {
  if (socket.connected) {
    chrome.runtime.sendMessage({ event: "socketStatus", data: true });
  } else {
    chrome.runtime.sendMessage({ event: "socketStatus", data: false });
  }
}

chrome.runtime.onMessage.addListener(function (
  message,
  sender,
  senderResponse
) {
  if (message.event === "joinRoom") {
    checkStatus();
    if (existingConnection) {
      alert("You are already in a room");
    } else {
      existingConnection = true;
      userData = {
        username: message.data.username,
        roomID: message.data.roomID,
      };
      socket.emit("joinRoom", userData);
    }
  } else if (message.event === "checkAlive") {
    checkStatus();
    if (existingConnection) {
      chrome.runtime.sendMessage({
        event: "checkAlive",
        data: { userData: userData, users: user_list },
      });
    } else {
      chrome.runtime.sendMessage({ event: "checkAlive", data: "" });
    }
  } else if (message.event === "syncVideo") {
    socket.emit("syncVideo", [userData, message.data]);
  } else if (message.event === "leaveRoom") {
    socket.emit("leaveRoom", userData);
    chatData = [];
    existingConnection = false;
  } else if (message.event === "sendMessage") {
    chatData.push({ username: userData.username, message: message.data });
    socket.emit("sendMessage", { userData: userData, message: message.data });
  } else if (message.event === "fetchMessages") {
    chrome.runtime.sendMessage({ event: "sendMessage", data: chatData });
  } else if (message.event === "setVideoState") {
    chrome.tabs.executeScript(
      null,
      { file: "./script/getDuration_netflix.js" },
      (data) => {
        var time = data[0][0];
        var isPaused = data[0][1];
        socket.emit("syncVideo", [userData, [time, isPaused]]);
      }
    );
  }
});

socket.on("joinRoom", (users) => {
  chrome.runtime.sendMessage({
    event: "joinRoom",
    data: { userData: userData, users: users },
  });
  user_list = users;
});

socket.on("leaveRoom", (users) => {
  chrome.runtime.sendMessage({ event: "leaveRoom", data: users });
});

socket.on("syncVideo", (data) => {
  duration = data[0];
  isPaused = data[1];
  chrome.tabs.executeScript(null, {
    code: `player.seek(${duration});`,
  });
  if (isPaused) {
    chrome.tabs.executeScript(null, {
      code: `var netflix_media= document.querySelectorAll('video')[0]; 
      netflix_media.pause()`,
    });
  } else {
    chrome.tabs.executeScript(null, {
      code: `var netflix_media= document.querySelectorAll('video')[0]; 
      netflix_media.play()`,
    });
  }
});

socket.on("sendMessage", (data) => {
  username = data.username;
  message = data.message;
  console.log(`${username} says ${message}`);
  chatData.push({ username: username, message: message });
  chrome.runtime.sendMessage({ event: "sendMessage", data: chatData });
});

console.log("background netflix");
