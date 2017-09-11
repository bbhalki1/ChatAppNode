var socket = io();
socket.on('connect',function (){
	console.log('Connected to server');
});
socket.on('disconnect',function() {
	console.log('Disconnected from server');
});

socket.on('newMessage',function(message){
	var formattedTime = moment(message.createAt).format('h:mm a');

	// console.log('newMessage',message);
	// var li =jQuery('<li></li>');
	// li.text(`${message.from} ${formattedTime}: ${message.text}`);

	// jQuery('#messages').append(li);

	var template = jQuery('#message-template').html();
	var html = Mustache.render(template,{
		text: message.text,
		from: message.from,
		createAt: formattedTime

	});
	jQuery('#messages').append(html);
});

// socket.emit('createMessage',{
// 	from:'Frank',
// 	text:'Hi'
// },function(){
// 	console.log('Yes!');
// });

socket.on('newLocationMessage',function(message){
	// var li =jQuery('<li></li>');
	var formattedTime = moment(message.createAt).format('h:mm a');
	// var a = jQuery('<a target="_blank"> My Current Location </a>');
	// li.text(`${message.from}: ${formattedTime}`);
	// console.log('URL', message.url);
	// a.attr('href', message.url);
	// li.append(a);
	// jQuery('#messages').append(li);

	var template = jQuery('#location-message-template').html();
	var html = Mustache.render(template,{
		from: message.from,
		url: message.url,
		createAt: formattedTime

	});
	jQuery('#messages').append(html);

});	

jQuery('#message-form').on('submit',function(e){
	e.preventDefault();
	var messageTextbox = jQuery('[name=message]');
	socket.emit('createMessage',{
		from: 'User',
		text: messageTextbox.val()
	},function(){
		messageTextbox.val('')
	});
});

var locationButton = jQuery('#send-location');
locationButton.on('click',function(){
	if (!navigator.geolocation) {
		return alert('Geolocation not supported');
	}

	locationButton.attr('disabled','disabled').text('Sending location...');

	navigator.geolocation.getCurrentPosition(function(position){
		locationButton.removeAttr('disabled').text('Send Location..');
		console.log(position);
		socket.emit('createLocationMessage',{
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	},function(){
locationButton.removeAttr('disabled').text('Send Location..');
		alert('Unable to fetch');
	});
});

