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

function removeUser(userData){
    roomID = userData.roomID
    username = userData.username
    for (i = 0; i < rooms[roomID].length; ++i){
        if (rooms[roomID][i].username === username){
            rooms[roomID].splice(i, 1);
            break
        }
    }
}

function getHostName(roomID){
    return rooms[roomID][0].username
}

function getHostUserID(roomID){
    return rooms[roomID][0].userID
}

function getUsers(roomID){
    return rooms[roomID]
}

module.exports = {
    addUser,getHostName,getHostUserID,getUsers,removeUser
}
