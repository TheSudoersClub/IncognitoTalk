 // let port = prompt("Enter port of room: ");
 let username = prompt("Enter your name: ");


 const socket = new WebSocket(`ws://localhost:55555`);

 socket.onopen = () => {
     socket.send(`Tadaaa....... ${username} joined the chat`);
 };

 socket.onmessage = (event) => {
     const reader = new FileReader();
     reader.addEventListener('loadend', (e) => {
         const messages = document.getElementById('messages');
         messages.innerHTML += `<br>${e.srcElement.result}`;

     });
     reader.readAsText(event.data);

 };


 function sendMessage() {
     const message = document.getElementById('message').value;
     socket.send(`${username}: ${message}`);
 }