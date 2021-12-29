// Make Connection

var socket = io.connect('http://localhost:4000')


// Query DOM

var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback')
    video = document.querySelector('video')


// Emit events

btn.addEventListener('click', function(){
    socket.emit('chat',{
        message: message.value,
        handle: handle.value
    })
})


message.addEventListener('keypress',function(){
    socket.emit('typing',handle.value)
})


video.addEventListener('seeking', function(event){
  socket.emit('videoseek',video.currentTime)
});


// Listen for events

socket.on('chatdata',function(data){
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    feedback.innerHTML = ''
})

socket.on('typing',function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
})

socket.on('videoseek',function(data){
    feedback.innerHTML = data;
    video.currentTime = data;
})