// Background script for youtube

async function Alive(time) {
  console.log("service worker is running");
  setTimeout(() => Alive(time), time);
}

Alive(60 * 1000);

var socket = io.connect("http://localhost:4000");
//var socket = io.connect('https://watchpartyserver.herokuapp.com/')

var existingConnection = false;
var userData = {};
var user_list = {};
var chatData = [];
var CurrHostName = "";
var curr_roomID = null;

// function for checking socket status
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
    console.log("JoinRoom event is being listened in bg.js ");
    // alert('event received' ) ;
    checkStatus();

    if (existingConnection) {
      alert("You are already in a room");
    } else {
      existingConnection = true;
      userData = {
        username: message.data.username,
        roomID: message.data.roomID,
      };

      curr_roomID = userData.roomID;

      console.log("socket.emit(joinRoom) from bg.js line 37");

      socket.emit("joinRoom", userData);
    }
  } else if (message.event === "checkAlive") {
    checkStatus();
    if (existingConnection) {
      chrome.runtime.sendMessage({
        event: "checkAlive",
        data: {
          userData: userData,
          users: user_list,
          currHostName: currHostName,
        },
      });
    } else {
      chrome.runtime.sendMessage({ event: "checkAlive", data: "" });
    }
  } else if (message.event === "syncNetflix") {
    socket.emit("syncNetflix", [userData, message.data]);
  } else if (message.event === "syncYoutube") {
    socket.emit("syncYoutube", [userData, message.data]);
  } else if (message.event === "leaveRoom") {
    socket.emit("leaveRoom", userData);
    chatData = [];
    existingConnection = false;
  } else if (message.event === "sendMessage") {
    chatData.push({ username: userData.username, message: message.data });
    socket.emit("sendMessage", { userData: userData, message: message.data });
  } else if (message.event === "fetchMessages") {
    chrome.runtime.sendMessage({ event: "sendMessage", data: chatData });
  } else if (message.event === "setVideoStateYoutube") {
    chrome.tabs.executeScript(
      null,

      { file: "./script/getDuration_youtube.js" },
      (data) => {
        var time = data[0][0];
        var isPaused = data[0][1];
        socket.emit("syncYoutube", [userData, [time, isPaused]]);
      }
    );
  } else if (message.event === "setVideoStateHotstar") {
    chrome.tabs.executeScript(
      null,
      { file: "./script/getDuration_hotstar.js" },
      (data) => {
        var time = data[0][0];
        var isPaused = data[0][1];
        socket.emit("syncHotstar", [userData, [time, isPaused]]);
      }
    );
  } else if (message.event === "setVideoStateNetflix") {
    chrome.tabs.executeScript(
      null,
      { file: "./script/getDuration_netflix.js" },
      (data) => {
        var time = data[0][0];
        var isPaused = data[0][1];
        socket.emit("syncNetflix", [userData, [time, isPaused]]);
      }
    );
  } else if (message.event === "startRecording") {
    console.log("executing contentScript . . . ");
    chrome.tabs.executeScript({
      file: "./script/contentScript.js",
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { greeting: "hello" },
        function (response) {}
      );
    });
  } else if (message.event === "stopRecording") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { greeting: "stopRecording" },
        function (response) {}
      );
    });
  } else if (message.event === "file-share") {
    const buffer = new Uint8Array(message.buffer);
    console.log(`emitting file-share event with buffer : `, buffer); 
    
    socket.emit("file-share", {
      metadata: message.metadata,
      buffer: buffer,
      targetRoomId: curr_roomID,
    });
  }
});

socket.on("joinRoom", (data) => {
  console.log("socket receives joinRoom bg.js 106");

  CurrHostName = data[1];
  console.log(`current host: ${CurrHostName}`);
  chrome.runtime.sendMessage({
    event: "joinRoom",
    data: { userData: userData, users: data[0], CurrHostName: data[1] },
  });
  user_list = data[0];
});

socket.on("leaveRoom", (data) => {
  console.log(`current host: ${data[1]}`);
  chrome.runtime.sendMessage({
    event: "leaveRoom",
    data: { userData: userData, users: data[0], currHostName: data[1] },
  });
});

//socket connection for youtube
socket.on("syncYoutube", (data) => {
  duration = data[0];
  isPaused = data[1];
  chrome.tabs.executeScript(null, {
    code: `var videoElements = document.querySelectorAll('video')[0]; videoElements.currentTime = ${duration}`,
  });
  if (isPaused) {
    chrome.tabs.executeScript(null, {
      code: `var videoElements = document.querySelectorAll('video')[0]; videoElements.pause()`,
    });
  } else {
    chrome.tabs.executeScript(null, {
      code: `var videoElements = document.querySelectorAll('video')[0]; videoElements.play()`,
    });
  }
});
//socket connection for Hotstar
socket.on("syncHotstar", (data) => {
  duration = data[0];
  isPaused = data[1];
  chrome.tabs.executeScript(null, {
    code: `var videoElements = document.querySelectorAll('video')[0]; videoElements.currentTime = ${duration}`,
  });
  if (isPaused) {
    chrome.tabs.executeScript(null, {
      code: `var videoElements = document.querySelectorAll('video')[0]; videoElements.pause()`,
    });
  } else {
    chrome.tabs.executeScript(null, {
      code: `var videoElements = document.querySelectorAll('video')[0]; videoElements.play()`,
    });
  }
});
//socket connection for netflix
socket.on("syncNetflix", (data) => {
  duration = data[0];
  isPaused = data[1];
  chrome.tabs.executeScript(null, {
    code: `const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
    const player = videoPlayer.getVideoPlayerBySessionId(videoPlayer.getAllPlayerSessionIds()[0]);
    // player.seek(${duration});`,
  });
  if (isPaused) {
    chrome.tabs.executeScript(null, {
      code: `var netflix_media= document.querySelectorAll('video')[0]; 
      netflix_media.pause();`,
    });
  } else {
    chrome.tabs.executeScript(null, {
      code: `var netflix_media= document.querySelectorAll('video')[0]; 
      netflix_media.play();`,
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

socket.on("send-notification", (data) => {
  console.log(data);
  showNotification(data);

  function showNotification(message) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "../assets/icons/WPicon.png",
      title: "Room Notification",
      message: message,
    });
  }
});

socket.on("file-sent", (metadata) => {
  console.log("File successfully sent:", metadata);
  alert("Yayy! File sent 🎉");
});

window.addEventListener("load", () => {
  console.log("New instance for newFile created");

  let newFile = {
    buffer: [],
    metadata: null,
  };

  socket.on("file-metadata", (metadata) => {
    newFile.metadata = metadata;
    newFile.buffer = [];

    console.log("received metadata ⚡️", metadata);
  });

  socket.on("file-sent", (metadata) => {
    console.log("File successfully sent:", metadata);
    alert("Yayy! File sent 🎉");
  });

  socket.on("file-chunk", (chunk) => {
    let chunkSize = 1024;

    newFile.buffer.push(chunk);
    console.log(newFile.buffer);

    if (newFile.metadata) {
      console.log(
        "Buffer size and metadata buffer size:",
        newFile.buffer.length,
        newFile.metadata.bufferSize
      );

      if (newFile.buffer.length * chunkSize >= newFile.metadata.bufferSize) {
        console.log("All chunks received. Initiating download...");
        console.log("Received buffer size:", newFile.buffer.length);

        let receivedFile = new Blob(newFile.buffer);

        console.log("receivedFile", receivedFile);

        chrome.runtime.sendMessage({
          event: "downloadFile",
          buffer: receivedFile,
          filename: newFile.metadata.filename,
        });

        newFile = {};
        alert("Yayy! File received 🎉");
      }
    }
  });

  function downloadFile(blob, name = "shared.txt") {
    alert("Do u wanna download the file ?");

    console.log("blob from download function : ", blob);

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = name;

    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );
  }
});



const workerScript = "script/service-worker.js";

// navigator.serviceWorker.register(workerScript);
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('script/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
    
    navigator.serviceWorker.addEventListener("message", (event) => {
      const message = event.data;
      console.log('Received a simple message in background:', message.data);
    });
}

// navigator.serviceWorker.addEventListener("message", (event) => {
//   const message = event.data;

//   if (message.event === "file-share") {
//     alert('Navigator se message mila'); 

//     const buffer = new Uint8Array(message.buffer);
//     console.log(`Navigator.sw : emitting file-share event with buffer : `,buffer); 

//     socket.emit("file-share", {
//       metadata: message.metadata,
//       buffer: buffer,
//       targetRoomId: curr_roomID,
//     });
//   }
// });

