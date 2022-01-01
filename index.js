var express = require('express')
var socket = require('socket.io')
var cors = require('cors')

const { addUser,getHostName, getHostUserID } = require('./utils/room')

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

        socket.on('joinRoom',({ username,roomID }) => {

            console.log('Someone joined room')
            socket.join(roomID)
            addUser({ username:username,roomID:roomID, userID:socket.id })
            socket.emit('joinRoom',`Connected to room<br><b>${getHostName(roomID)}</b> is the host`)
            socket.broadcast.to(roomID).emit('joinRoom',`<b>${username}</b> has joined the party`)
            io.to(getHostUserID(roomID)).emit('hostName', getHostUserID(roomID));
            // This listener is nested inside a listener
            
            socket.on('disconnect',() => {
                socket.broadcast.to(roomID).emit('leftRoom',`<b>${username}</b> has left the party`)
            })
            
            socket.on('pause',(userData) => {
                if (getHostName(userData.roomID) === userData.username){
                    socket.broadcast.to(roomID).emit('pause',`pause the video`)
                }
            })

        })

        

})
