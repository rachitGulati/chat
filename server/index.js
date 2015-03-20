var express=require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require("body-parser");
var io = require('socket.io')(http);
var cors = require('cors')
var users = {};
var users_key={};
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '192.168.1.218'
var nodemailer = require("nodemailer");
var randomstring = require("randomstring");


var smtpTransport = nodemailer.createTransport("SMTP", {
  service: "Gmail",
  auth: {
    XOAuth2: {
      user: "nodechat2015@gmail.com", // Your gmail address.
                                            // Not @developer.gserviceaccount.com
      clientId: "966592693700-2un54cfebriv58i79hq5qhn1vl4gmv4i.apps.googleusercontent.com",
      clientSecret: "h3HcLZ4XyDaQDolvFPLVSTpY",
      refreshToken: "1/e24zWw_2mpK5_GsaRj3eLIjbW1tNGJyQzbHfE8nds1g"
    }
  }
});

var mailOptions = {
  from: "nodechat2015@gmail.com",
  to: '',
  subject:"Node chat One Time Key",
  generateTextFromHTML: true,
  html:''
};


app.use(cors());

app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/../client'));

app.get('/', function(req, res){
 res.sendFile('index.html');
});

app.post('/getKey', function(req, res){
      var key=randomstring.generate(7);
      mailOptions.to=req.body.email;
      var html='<table width="60%" style="background:#ffe4b2; color:#999;"><tr><td align="center"><h1 style="margin:0px">Node Chat Welcome you</h1></td></tr><tr><td align="center"><div style="margin:30px;border:1px solid #ccc;width:300px;background:white;box-shadow: 5px 5px 5px #888888;"><p><strong>Hello '+req.body.name+',</strong></p>Here is your code for verification : <strong>'+key+'</strong></div></td></tr></table>';
mailOptions.html=html;
      
       smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
          console.log(error);
        } else {
          var user_email=req.body.email;
          users_key[user_email]=key;
        }
        smtpTransport.close();
      });
  res.end();
});
app.post('/join', function(req, res){

   var user_email = req.body.email;
   var user_key=req.body.key;

   if(users_key[user_email]==user_key)
   {
    res.send();
   }else{
    res.status(401)        // HTTP status 404: NotFound
   .send('Not found');
   }


});

io.on('connection', function(socket){
    
   socket.on('chat message', function(message_body){
    socket.broadcast.emit('chat message',message_body);
  });
   socket.on('join', function(user){
    socket.user = user;
    users[user.email] = user;
  	io.sockets.emit('userUpdate', users);
  });
  socket.on('disconnect', function(){
    if(typeof socket.user!= 'undefined'){
    var user =socket.user;
    delete users[user.email];
    io.sockets.emit('userUpdate', users);
  }

  });
});

http.listen(server_port,server_ip_address, function(){
  console.log('listening on *:3000');
});