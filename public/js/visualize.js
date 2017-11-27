var SOCKET_ENDPOINT = 'http://localhost:3030/';

var setupSocket = function () {
  var socket = io(SOCKET_ENDPOINT);
  socket.on('connect', function(){
    console.log("Connected to server");

    socket.on('event', function(data) {
      console.log("Event", data);
    });
  });

  socket.on('disconnect', function(){
    console.log("Disconnected")
  });

}

window.onload = function() {
  console.log("Initializing");
  setupSocket();
};
