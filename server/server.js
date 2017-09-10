const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage,generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname , '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New User Connected');

	// socket.emit('newMessage',{
	// 	from:'Admin',
	// 	text:'Welcome To chat ',
	// 	createdAt:new Date().getTime()
	// });
	socket.emit('newMessage',generateMessage('Badri','Welcome To chat App'));

	// socket.broadcast.emit('newMessage',{
	// 	from:'Admin',
	// 	text:'Welcome To chat ',
	// 	createdAt:new Date().getTime()
	// });

	socket.broadcast.emit('newMessage',generateMessage('Admin','New User Joined'));

	socket.on('createMessage',(message,callback) => {
		console.log('createMessage',message);
		// io.emit('newMessage',{
		// 	from:message.from,
		// 	text:message.text,
		// 	createdAt:new Date().getTime()
		// });
		io.emit('newMessage',generateMessage(message.from,message.text));
		// socket.broadcast.emit('newMessage',{
		// 	from:message.from,
		// 	text:message.text,
		// 	createdAt:new Date().getTime()
		// });
		callback('From Server');

	});

	socket.on('createLocationMessage',(coords)=>{
		io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
	})

	socket.on('disconnect', () =>{
		console.log('User disconnected')
	});
});



server.listen(port,() => {
	console.log(`Server is up on ${port}`)
});