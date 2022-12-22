#  Introduction
There are two parts to this project
- Frontend (Chrome Extension)
- Backend (Node.js Backend)

#  Chrome Extension
There are three separate Javascript program running at different places:

- __Background Script__: This script runs in the background as soon as the browser is opened. This script maintains the socket connection with the server and it performs most background tasks like receiving. It acts as a mediator for communication between the content and extension script.

- __Extension Script__: This script runs in the background when the extension popup is running, it mostly communicates with the background scripts as user interacts with the extension popup elements such as sending message, joining or leaving rooms.

- __Content Script__ : This script is injected into the all the tabs which are of YouTube. This script monitors the timestamp of the video and the state of the play/pause button. It also communicates with the background script to modify the timestamp of the video or change it's play/pause state.

## Background Script
There are two types of socket instance, one are listeners which listen for data from the other users in the room and other are emitters which send data to other clients in the room.

Both sockets have different type of events, the listeners have the following socket events:

- joinRoom
- checkAlive
- syncVideo
- leaveRoom
- sendMessage
- fetchMessages
- setVideoState

These listeners can listen for events from other clients in the group or local scripts such as extension or content scripts.
