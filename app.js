var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var userlist    = [];
var socketIds = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  // joinRoom(클라이언트에서 보낸 룸 정보 받기)
  socket.on('joinRoom', function(data) {
    var roomName = data.roomName;
    console.log(socketIds);
    console.log('조인룸', data);
    socketIds[data.nickName] = socket.id;
    socket.join(roomName);
console.log(socketIds);
    console.log('***********');
    console.log(io.sockets.adapter.rooms);
    console.log('*****************');

    io.sockets.in(roomName).emit('joinRoom', data.roomName, data.nickName, socketIds);

  });

  //클라이언트에서 보낸 메세지 받기
	socket.on('sendMessage', function(data) {
		console.log('서버 전송데이터', data);
    //클라이언트로 메세지 보내기
    socket.broadcast.in(data.roomName).emit('sendMessage', {
      'msg': data.msg,
      'nickName': data.nickName,
      'roomName' : data.roomName
    });
	});

  socket.on('typing', function() {
    console.log('서버 typing');
    socket.broadcast.emit('typing');
  });

	socket.on('disconnect', function(data) {
		console.log('disconnected++++', data);
	});
});


// static 경로
app.use(express.static(__dirname + '/public'));

http.listen(3000, function() {
	console.log('listening on *:3000');

});
