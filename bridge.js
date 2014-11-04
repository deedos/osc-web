var osc = require('node-osc'),
    io = require('socket.io').listen(8081);
    
var app = require('express')();
var http = require('http').Server(app);

var oscServer, oscClient;

// usando a 3000 pra servir o html

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.sockets.on('connection', function (socket) {
  socket.on("config", function (obj) {
    oscServer = new osc.Server(obj.server.port, obj.server.host);
    oscClient = new osc.Client(obj.client.host, obj.client.port);

    oscClient.send('/status', socket.sessionId + ' connected');

    oscServer.on('message', function(msg, rinfo) {
      console.log(msg, rinfo);
      socket.emit("message", msg);
    });
  });
  socket.on("message", function (obj) {
    oscClient.send(obj);
  });
});

// Redireciona pro index.html

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
