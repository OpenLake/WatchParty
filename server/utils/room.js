var rooms = {}

function addUser(roomObj){
    const username = roomObj.username
    const roomID = roomObj.roomID
    const userID = roomObj.userID
    if (roomID in rooms){
        rooms[roomID].push({username,userID})
    }else{
        rooms[roomID] = [{username,userID}]
    }
}

function removeUser({ roomID, userID }){
    
}

function getHostName(roomID){
    return rooms[roomID][0].username
}

function getHostUserID(roomID){
    return rooms[roomID][0].userID
}


module.exports = {
    addUser,getHostName,getHostUserID
}
