// Client-side script
const socket = io();
const messageForm = document.querySelector('#message-form');
const input = document.querySelector('input');

socket.on('welcomeMessage', (welcomeMessage) => {
  console.log(welcomeMessage);
});

messageForm.addEventListener('submit', (e) => {
	e.preventDefault()
	const message = input.value
	// console.log(message)

	socket.emit('sendMessage', message)
})


// socket.on('countUpdated', (count) => {
// 	console.log('The count has been updated', count)
// })
// document.querySelector('#increment').addEventListener('click', () => {
// 	socket.emit('increment')
// })
// document.querySelector('#decrement').addEventListener('click', () => {
// 	socket.emit('decrement')
// })
