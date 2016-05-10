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
    if(!socketIds[roomName]) {
      socketIds[roomName] = {};
    }
    socketIds[roomName][socket.id] = data.nickName;
    socket.join(roomName);
    io.sockets.in(roomName).emit('joinRoom', {
      roomName:data.roomName,
      nickName:data.nickName,
      socketIds:socketIds
    });
  });

  //클라이언트에서 보낸 메세지 받기
	socket.on('sendMessage', function(chatData) {
		console.log('서버 전송데이터', chatData);
    var data = chatData;
    //클라이언트로 메세지 보내기
    if(data.secret) {
      io.sockets.in(data.toSocket).emit('sendMessage', data);
    }else {
      socket.broadcast.in(data.roomName).emit('sendMessage', data);
    }
	});

  socket.on('leaveRoom', function(leaveData) {
    var data = leaveData;
    console.log('leaveRoom----', data);
    console.log('beforeDelete------', socketIds);
    socket.leave(data.roomName);
    console.log(socketIds[data.roomName][data.socketId]);
    delete socketIds[data.roomName][data.socketId];
    //나간사람 데이터 (방이름, 나간사람 소켓아이디, 남아있는 방정보)
    socket.broadcast.emit('leaveRoom', data.roomName, data.socketId);
    console.log('delete socket---------', socketIds);
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
app.use(express.static(__dirname));

http.listen(3000, function() {
	console.log('listening on *:3000');

});
