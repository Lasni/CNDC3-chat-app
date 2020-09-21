// Client-side script
const socket = io();
// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
// Templates
const $messageTemplate = document.querySelector('#message-template').innerHTML;
const $locationTemplate = document.querySelector('#location-template').innerHTML;
// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// message listener
socket.on('message', ({ username, text, createdAt }) => {
  const html = Mustache.render($messageTemplate, {
    username,
    text,
    createdAt: moment(createdAt).format('k:m:s')
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

// locationMessage listener
socket.on('locationMessage', ({ username, locationURL, createdAt }) => {
  const html = Mustache.render($locationTemplate, {
    username,
    locationURL,
    createdAt: moment(createdAt).format('k:m:s')
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

// Submit form event
$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute('disabled', 'disabled'); // disable the form once it's been submitted
  const message = e.target.elements.message.value;
  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled'); // re-enable it after callback was called on server
    $messageFormInput.value = ''; // clear the input after message was delivered
    $messageFormInput.focus(); // re-focus the input
    if (error) {
      return console.log(error);
    } else {
      console.log('Message delivered', message);
    }
  });
});

// Send location event
$sendLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  } else {
    $sendLocationButton.setAttribute('disabled', 'disabled'); // disable button
    // is async but doesn't support promises. Use callback func.
    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit(
        'sendLocation',
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        () => {
          // callback function where client acknowledges that the callback function was caught and called on server side
          $sendLocationButton.removeAttribute('disabled'); // re-enable button again
          console.log('Location shared');
        }
      );
    });
  }
});

// Emit a join event to the server when a new user joins
socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});
