// declarations
const socketLink = 'localhost:7772';

let username;

document
  .querySelector("#input-nick-name-prompt")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      // get the username
      username = document.getElementById("input-nick-name-prompt").value;

      // remove white spaces  
      username = username.trim();

      // if username is not empty
      if (username != "" && username.length > 0) {
        document.querySelector(".nick-name-prompt").style.display = "none";
        document.querySelector('.container').style.display = 'flex';
        initializeWebSocket();
      }
    }
  });


let socket;

const initializeWebSocket = () => {

  socket = new WebSocket(`ws://${socketLink}`);

  const chatBox = document.getElementById("chats");

  // before unloading the window (when client is disconnected from socket)
  window.onbeforeunload = function () {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(`USER_LEFT: ${username}`); // send the "USER_LEFT" message to the server
    }
  };

  // when client connected to socket 
  socket.onopen = () => {
    socket.send(`USER_JOINED: ${username}`); // send the "USER_JOINED" message to the server
  };

  // when socket is closed 
  socket.onclose = () => {

    // display server terminated message when socket-server is closed
    chatBox.innerHTML += `<br><div class="server-terminated">⚠️ Server Terminated</div>`;

    scrollToBottom();
  };

  // handle chatBox on socket message event 
  socket.onmessage = () => {
    handleMessage(chatBox);
  }


}

const handleMessage = (chatBox) => {

  const reader = new FileReader();

  reader.addEventListener("loadend", (e) => {

    scrollToBottom(); // scroll to bottom when new message is received

    const data = e.srcElement.result; // received data from socket server 

    // "user joined" message
    if (data.startsWith("USER_JOINED: ")) {
      const username = data.slice("USER_JOINED: ".length); // get the username of user

      // update message
      chatBox.innerHTML += `<br><div class="user-joined">${username} joined the chat</div>`;

      playNotificationSfx();
    }

    // "user joined" message
    else if (data.startsWith("USER_LEFT: ")) {
      const username = data.slice("USER_LEFT: ".length); // get the username of user

      // update message
      chatBox.innerHTML += `<br><div class="user-left">${username} left the chat</div>`;
    }

    // regular message
    else {
      // update message
      chatBox.innerHTML += `<div class="send-message">${data}</div>`;

      playNotificationSfx();
    }
  });

  reader.readAsText(event.data);
};

const sendMessage = () => {
  // get the message from user 
  const message = document.getElementById("input-send-message").value;

  if (message != "") {
    // sent message to socket server 
    socket.send(`<span class="username">${username} : &nbsp;</span> ${message}`);

    // clear the input when message is send 
    document.getElementById("input-send-message").value = "";
  }
}

const scrollToBottom = () => {
  document
    .getElementById("chats")
    .scrollTo(0, document.getElementById("chats").scrollHeight);
}

const playNotificationSfx = () => {
  var notificationSfx = new Audio("../assets/sfx/notification-sfx-discord.mp3");
  if (document.hidden) {
    notificationSfx.play();
  }
}