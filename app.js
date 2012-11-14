var express = require('express');
//var mime = require('mime');
var app = require('express').createServer();
var io = require('socket.io').listen(app);
//var usernames1={};
app.listen(8082);

// routing
//app.get('/videos/', function (req, res) {
 // res.send(__dirname + '/test.mp4');	
//});

app.use(express.static(__dirname + '/videos'));
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/videos/index.html');	
});
//app.get('/', function (req, res) {
 // res.sendfile(__dirname + '/index.html');	
//});


// usernames which are currently connected to the chat
var usernames = {};
var x=new Array();
var y=new Array();
//var usercount=0;
//var videoTime=5;
io.sockets.on('connection', function (socket) {

        // when the client emits 'sendchat', this listens and executes
        socket.on('sendchat', function (a,b,colorb) {
                // we tell the client to execute 'updatechat' with 2 parameters
                //chat=data;
                x[socket.username]=a;
                y[socket.username]=b;
		
                socket.broadcast.emit('updatechat',a,b,colorb);
        });

        socket.on('sendchat1', function (a,b,colorb) {
                // we tell the client to execute 'updatechat' with 2 parameters
                //chat=data;
                socket.broadcast.emit('updatechat1',a,b,x[socket.username],y[socket.username],colorb);
                x[socket.username]=a;
                y[socket.username]=b;
        });

        socket.on('sendchat2', function (data) {
                // we tell the client to execute 'updatechat' with 2 parameters
                io.sockets.emit('updatechat2', socket.username, data);
        });
	
	socket.on('sendvideo',function(videoTime){
		io.sockets.emit('updatevideo',videoTime)
	});

        // when the client emits 'adduser', this listens and executes
        socket.on('adduser', function(username){
                x[socket.username]=-1;
                y[socket.username]=-1; 
                // we store the username in the socket session for this client
                socket.username = username;
                // add the client's username to the global list
                //usernames[usercount++] = username;
                usernames[username]=username;
                // echo to client they've connected
                socket.emit('updatechat2', '[', 'you have connected:]');
                // echo globally (all clients) that a person has connected
                socket.broadcast.emit('updatechat2', 'SERVER', username + ' has connected');
                // update the list of users in chat, client-side
                io.sockets.emit('updateusers', usernames);
        });

        // when the user disconnects.. perform this
        socket.on('disconnect', function(){
                // remove the username from global usernames list
                delete usernames[socket.username];
                // update list of users in chat, client-side
                io.sockets.emit('updateusers', usernames);
                socket.broadcast.emit('updatechat2', 'SERVER', socket.username + ' has disconnected');
                // echo globally that this client has left
        });

	socket.on('pausing',function(){
			io.sockets.emit('pause');			
		});
      
});

	
