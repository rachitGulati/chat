var express=require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cors = require('cors')
var users = {};
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '192.168.1.218'

app.use(cors());

app.use(express.static(__dirname + '/../client'));

app.get('/', function(req, res){
 res.sendFile('index.html');
});
io.on('connection', function(socket){
    
  console.log('a user connected');
   socket.on('chat message', function(message_body){
    console.log('Message'+message_body)
    socket.broadcast.emit('chat message',message_body);
  });
   socket.on('join', function(user){
    socket.user = user;
    users[user.email] = user;
   	console.log("join->"+user.name);
  	io.sockets.emit('userUpdate', users);
  });
  socket.on('disconnect', function(){
    if(typeof socket.user!= 'undefined'){
    var user =socket.user;
    console.log('user disconnected'+user.name);
    delete users[user.email];
    io.sockets.emit('userUpdate', users);
  }

  });
});

http.listen(server_port,server_ip_address, function(){
  console.log('listening on *:3000');
});