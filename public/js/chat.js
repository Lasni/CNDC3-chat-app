// Client-side script
const socket = io();
const messageForm = document.querySelector('#message-form');
const sendLocationButton = document.querySelector('#send-location');

socket.on('message', (message) => {
  console.log(message);
});

// Submit form event
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit('sendMessage', message);
});

// Send location event
sendLocationButton.addEventListener('click', () => {
  // e.preventDefault()
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  } else {
    // is async but doesn't support promises. Use callback func.
    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit('sendLocation', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    });
  }
});
