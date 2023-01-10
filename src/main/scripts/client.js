// declarations
const link = "bore.pub:39757";
var username;

document
  .querySelector("#input-nick-name-prompt")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      username = document.getElementById("input-nick-name-prompt").value;
      initializeWebSocket();
    }
  });

var socket;

window.onbeforeunload = function () {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(`USER_LEFT: ${username}`);
  }
};

function initializeWebSocket() {
  socket = new WebSocket(`ws://${link}`);

  socket.onopen = () => {
    socket.send(`USER_JOINED: ${username}`); // send the "USER_JOINED" message to the server
  };
  socket.onclose = () => {
    const messages = document.getElementById("chats");
    messages.innerHTML += `<br><div class="server-terminated">⚠️ Server Terminated</div>`; // send the "USER_JOINED" message to the server
    scrollToBottom();
  };

  socket.onmessage = (event) => {
    const reader = new FileReader();

    reader.addEventListener("loadend", (e) => {
      // scroll to bottom when new message received
      scrollToBottom();

      const data = e.srcElement.result;

      if (data.startsWith("USER_JOINED: ")) {
        // this is a "user joined" message
        const username = data.slice("USER_JOINED: ".length);
        const messages = document.getElementById("chats");

        messages.innerHTML += `<br><div class="user-joined">${username} joined the chat</div>`;
        playNotificationSfx();
      } //
      else if (data.startsWith("USER_LEFT: ")) {
        // this is a "user joined" message
        const username = data.slice("USER_LEFT: ".length);
        const messages = document.getElementById("chats");

        messages.innerHTML += `<br><div class="user-left">${username} left the chat</div>`;
      } //
      else {
        // this is a regular message
        const messages = document.getElementById("chats");

        messages.innerHTML += `<div class="send-message">${data}</div>`;
        playNotificationSfx();
      }
    });

    reader.readAsText(event.data);
  };
}

setInterval(ScrollDiv, 50);

function sendMessage() {
  const message = document.getElementById("input-send-message").value;
  socket.send(`<span class="username">${username} : &nbsp;</span> ${message}`);
  document.getElementById("input-send-message").value = "";
}

function scrollToBottom() {
  document
    .getElementById("chats")
    .scrollTo(0, document.getElementById("chats").scrollHeight);
}

function playNotificationSfx() {
  var notificationSfx = new Audio("../assets/sfx/notification-sfx-discord.mp3");
  if (document.hidden) {
    notificationSfx.play();
  }
}