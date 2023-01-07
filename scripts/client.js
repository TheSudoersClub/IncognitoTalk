// declarations
var username;

document
  .querySelector("#input-nick-name-prompt")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      username = document.getElementById("input-nick-name-prompt").value;
      console.log(username);
    }
  });

const socket = new WebSocket(`ws://localhost:55555`);

socket.onopen = () => {
  socket.send(`Tadaaa....... ${username} joined the chat`);
  console.log(username);
};

socket.onmessage = (event) => {
  const reader = new FileReader();
  reader.addEventListener("loadend", (e) => {
    const messages = document.getElementById("messages");
    messages.innerHTML += `<br>${e.srcElement.result}`;
  });
  reader.readAsText(event.data);
};

function sendMessage() {
  const message = document.getElementById("message").value;
  socket.send(`${username}: ${message}`);
}
