var express = require('express')
var socket = require('socket.io')
var cors = require('cors')

const { addUser,getHostName, getHostUserID, getUsers,removeUser } = require('./utils/room')

var app = express()
app.use(cors())

app.set('view engine','ejs')
app.get('/', (req,res) => {
    res.render('index');
});

const PORT = process.env.PORT || 4000

var server = app.listen(PORT,() => {
    console.log(`Listening to requests on port ${PORT}`)
})

app.get('/hello', (req, res) => {
    res.send("Hello");
})


var io = socket(server, {
    cors: {
        origin: '*'
    }
})


io.on('connection', (socket) => {
    console.log(`Connection made to socket id ${socket.id}`)

        socket.on('joinRoom',({ username,roomID }) => {

            console.log(`${username} joined room ${roomID}`)
            socket.join(roomID)
            addUser({ username:username,roomID:roomID, userID:socket.id })
            socket.emit('joinRoom',getUsers(roomID))
            socket.broadcast.to(roomID).emit('joinRoom',getUsers(roomID))
            io.to(getHostUserID(roomID)).emit('hostName', getHostUserID(roomID));
            // This listener is nested inside a listener
            
            socket.on('disconnect',() => {
                console.log(`${username} has left the room(Socket Disconnected)`)
                removeUser({username, roomID})
                socket.broadcast.to(roomID).emit('leaveRoom',getUsers(roomID))
                socket.leave(roomID)
            })


            socket.on('leaveRoom',(userData) => {
                console.log(`${userData.username} has left the room ${userData.roomID}`)
                removeUser(userData)
                socket.broadcast.to(roomID).emit('leaveRoom',getUsers(roomID))
                socket.leave(roomID)
            })
            

            socket.on('syncVideo',(data) => {
                
                // Only host can sync video
                
                userData = data[0]
                media = data[1]
                duration = media[0]
                isPaused = media[1]
                console.log(`sync request from ${userData.username} while media is running ${!media[1]}`)
                if (getHostName(userData.roomID) === userData.username){
                    socket.broadcast.to(roomID).emit('syncVideo',[duration,isPaused])
                }
            })

            socket.on('sendMessage', (data) => {
                username = data.userData.username
                roomID = data.userData.roomID
                message = data.message

                console.log(`${username} says ${message} in room ${roomID}`)
                socket.broadcast.to(roomID).emit('sendMessage',{username:username,message:message})

            })



        })

})


