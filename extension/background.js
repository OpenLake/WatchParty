console.log("Backgroup Script");

import {io} from "./node_modules/socket.io-client";

var socket = io.connect("http://localhost:4000");
// //var socket = io.connect('https://watchpartyserver.herokuapp.com/')

var existingConnection = false;
var userData = {};
var user_list = {};
var chatData = [];

// checks status of socket Connection

function checkStatus() {
  console.log(socket.connected);
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
    chrome.scripting.executeScript(null, { file: "./getDuration.js" }, (data) => {
      var time = data[0][0];
      var isPaused = data[0][1];
      socket.emit("syncVideo", [userData, [time, isPaused]]);
    });
  }
});

// functions

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
  function current(){
    var videoElements=document.querySelectorAll('video')[0]; 
    videoElements.currentTime = duration;
  }
  function pause(){
    var videoElements=document.querySelectorAll('video')[0]; 
    videoElements.pause();
  }
  function current(){
    var videoElements=document.querySelectorAll('video')[0]; 
    videoElements.play();
  }

  chrome.scripting.executeScript(null, {
    function: current()
  });
  if (isPaused) {
    chrome.scripting.executeScript(null, {
      function: pause()
    });
  } else {
    chrome.scripting.executeScript(null, {
      function: play()
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
