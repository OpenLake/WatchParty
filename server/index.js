var express = require("express");
// var socket = require("socket.io");
var cors = require("cors");

//I added these lines
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const app = express();
const server = createServer(app);

const {
  addUser,
  getHostName,
  getHostUserID,
  getUsers,
  removeUser,
  rooms,
} = require("./utils/room");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(
  cors({
    origin: "*",
  })
);

// app.use(cors());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log("server running at port : ", PORT);
});

app.get("/hello", (req, res) => {
  res.send("Hello");
});


// Empty string representing No Host yet
var CurrHostName = "";
var CurrHostUserID = "";

io.on("connection", (socket) => {
  console.log(`Connection made to socket id ${socket.id}`);

  socket.on("joinRoom", ({ username, roomID }) => {
    var message = `${username} joined room ${roomID}` ; 
    console.log(message);
    socket.join(roomID);

    socket.emit('send-notification', message);

    // if(!username) username="";

    addUser({ username: username, roomID: roomID, userID: socket.id });

    // emiting users in room=roomID with their current Host Name.
    socket.emit("joinRoom", [getUsers(roomID), CurrHostName]);
    socket.broadcast
      .to(roomID)
      .emit("joinRoom", [getUsers(roomID), CurrHostName]);

    // If there is no host in non empty room then make the 1st guy of room as host
    if (CurrHostUserID == "") {
      CurrHostUserID = getHostUserID(roomID);
    }
    if (CurrHostName == "") {
      CurrHostName = getHostName(roomID);
    }

    console.log(`curent Host in room ${roomID} is ${CurrHostName}`);

    io.to(CurrHostUserID).emit("hostName", CurrHostUserID);
  }); //-----------------

  // This listener is nested inside a listener

    socket.on("disconnect", () => {
      var message = `${username} has left the room(Socket Disconnected)`;
    console.log(message); 
    socket.emit('send-notification', message);

      removeUser({ username, roomID });
      socket.broadcast.to(roomID).emit("leaveRoom", [getUsers(roomID),CurrHostName]);
      socket.leave(roomID);
    });

    socket.on("leaveRoom", (userData) => {
      var message = `${userData.username} has left the room ${userData.roomID}` ;
      socket.emit('send-notification', message);

      removeUser(userData);
      if(userData.username==CurrHostName)
      {
        CurrHostName = getHostName(roomID);
      }
      socket.broadcast.to(roomID).emit("leaveRoom", [getUsers(roomID),CurrHostName]);
      socket.leave(roomID);
    });

    // Only host can sync video
    // socket Youtube
    socket.on("syncYoutube", (data) => {
      userData = data[0];
      media = data[1];
      duration = media[0];
      isPaused = media[1];
      console.log(
        `Youtube sync request from ${
          userData.username
        } while media is running ${!media[1]}`
      );
      if (CurrHostName === userData.username) {
        socket.broadcast.to(roomID).emit("syncYoutube", [duration, isPaused]);
      }
    });
    // socket Netflix
    socket.on("syncNetflix", (data) => {
      userData = data[0];
      media = data[1];
      duration = media[0];
      isPaused = media[1];
      console.log(
        `Netflix sync request from ${
          userData.username
        } while media is running ${!media[1]}`
      );
      if (CurrHostName === userData.username) {
        socket.broadcast.to(roomID).emit("syncNetflix", [duration, isPaused]);
      }
    });
    // socket Hotstar
    socket.on("syncHotstar", (data) => {
      userData = data[0];
      media = data[1];
      duration = media[0];
      isPaused = media[1];
      console.log(
        `Hotstar sync request from ${
          userData.username
        } while media is running ${!media[1]}`
      );
      if (CurrHostName === userData.username) {
        socket.broadcast.to(roomID).emit("syncHotstar", [duration, isPaused]);
      }
    });
    socket.on("sendMessage", (data) => {
      username = data.userData.username;
      roomID = data.userData.roomID;
      message = data.message;

      console.log(`${username} says ${message} in room ${roomID}`);
      socket.broadcast
        .to(roomID)
        .emit("sendMessage", { username: username, message: message });
    });
  // }); //--------------- i ve closed it above
});

