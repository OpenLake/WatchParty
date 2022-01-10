var express = require('express')
var socket = require('socket.io')
var cors = require('cors')

const { addUser,getHostName, getHostUserID, getUsers,removeUser } = require('./utils/room')

var app = express()
app.use(cors())

var server = app.listen(4000,() => {
    console.log('Listening to requests on port 4000')
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
    // console.log(getUsers(roomID))

        socket.on('joinRoom',({ username,roomID }) => {

            console.log(`${username} joined room ${roomID}`)
            socket.join(roomID)
            addUser({ username:username,roomID:roomID, userID:socket.id })
            socket.emit('joinRoom',getUsers(roomID))
            socket.broadcast.to(roomID).emit('joinRoom',getUsers(roomID))
            io.to(getHostUserID(roomID)).emit('hostName', getHostUserID(roomID));

            // console.log(getUsers(roomID))
            // This listener is nested inside a listener
            
            socket.on('disconnect',() => {
                console.log(`${username} has left the room(Socket Disconnected)`)
                removeUser({username, roomID})
                socket.broadcast.to(roomID).emit('leaveRoom',getUsers(roomID))
            })


            socket.on('leaveRoom',(userData) => {
                console.log(`${userData.username} has left the room ${userData.roomID}`)
                removeUser(userData)
                socket.broadcast.to(roomID).emit('leaveRoom',getUsers(roomID))
                // console.log(getUsers(roomID))
            })
            
            // socket.on('pause',(userData) => {
            //     console.log(`Pause request from ${userData.username}`)
            //     if (getHostName(userData.roomID) === userData.username){
            //         socket.broadcast.to(roomID).emit('pause',`pause the video`)
            //     }
            // })

            socket.on('syncVideo',(data) => {
                // Only host can sync video
                
                userData = data[0]
                lst = data[1]
                // duration = lst[0][0]
                // isPaused = lst[0][1]
                duration = lst[0]
                isPaused = lst[1]
                console.log(`sync req from ${userData.username} ${lst[1]}`)
                if (getHostName(userData.roomID) === userData.username){
                    socket.broadcast.to(roomID).emit('syncVideo',[duration,isPaused])
                }
                // socket.broadcast.to(roomID).emit('syncVideo',data)
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


