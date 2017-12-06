var socket = io('http://localhost:3000')
socket.on('EHLO', function(data) {
    // alert("I received data ! - " + data.hello);
});

socket.on('new-message', function(data){
    var temp = document.getElementById('messagesList').innerHTML;
    document.getElementById('messagesList').innerHTML = "<li>" 
                                + data.user.username 
                                + " : " + data.content 
                                + "</li>" 
                                + temp;
});