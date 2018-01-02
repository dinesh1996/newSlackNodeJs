
var socket = io('http://localhost:3000');

socket.on('new-message', function(data){
    var temp = document.getElementById('messagesList').innerHTML;
    document.getElementById('messagesList').innerHTML = "<li>" 
                                + data
                                + " : " + data
                                + "</li>" 
                                + temp;
});


