// address/url of webpage
const URL = window.location.href;

// get url (remove http:// or https://)
const SOCKETLINK = URL.split("://")[1];

// get the protocol of the website (http or https)
const PROTOCOL = SOCKETLINK.startsWith("https") ? "wss://" : "ws://";


// websocket server 
let socket;

async function initializeWebSocket() {
  socket = new WebSocket(`${PROTOCOL}${SOCKETLINK}socket`);

  const chatBox = document.getElementById("chats");

  // if decryption key is valid
  if (validKey) {

    // before unloading the window (when client is disconnected from socket)
    window.onbeforeunload = function () {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(encrypt(`USER_LEFT: ${username}`, key)); // send the "USER_LEFT" message to the server
      }
    };

    // when client connected to socket
    socket.onopen = () => {
      socket.send(encrypt(`USER_JOINED: ${username}`, key)); // send the "USER_JOINED" message to the server
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
    };
  }

  // if the decryption is invalid
  else {

    socket.onopen = () => {
      chatBox.innerHTML += `<div class="send-message encrypted-message">packet encrypted: invalid decryption key</div>`;
    };

    socket.onmessage = () => {
      chatBox.innerHTML += `<div class="send-message encrypted-message">packet encrypted: invalid decryption key</div>`;
    };
  }
}

let allowSentMessage = false;

function handleMessage(chatBox) {
  const reader = new FileReader();

  reader.addEventListener("loadend", async (event) => {

    // encrypted data received from server 
    let data = reader.result;

    // decrypt the data received from server with decryption key
    data = decrypt(data, key);

    // "user joined" message
    if (data.startsWith("USER_JOINED: ")) {
      const clientUsername = data.slice("USER_JOINED: ".length); // get the username of user

      // update list of joined clients (clients) 
      clients = await updateClients();

      // update allClients array
      allClients = [...clients, ...bots];

      // render new clients list 
      renderList(allClients);

      // update message
      chatBox.innerHTML += `<br><div class="user-joined">${clientUsername} joined the chat</div>`;

      // enable send message
      if (clientUsername === username) {
        allowSentMessage = true;
      }

      playNotificationSfx();
    }

    // "user joined" message
    else if (data.startsWith("USER_LEFT: ")) {
      const clientUsername = data.slice("USER_LEFT: ".length); // get the username of user

      // update list of joined clients (clients) 
      clients = await updateClients();

      // update allClients array
      allClients = [...clients, ...bots];

      // render new clients list 
      renderList(allClients);

      // disable send message
      if (clientUsername === username) {
        allowSentMessage = false;
      }

      // update message
      chatBox.innerHTML += `<br><div class="user-left">${clientUsername} left the chat</div>`;
    }

    // other message
    else {

      // get the normal to check weather the message is tagged or not
      const pattern = /<span class="username">(.+?) : &nbsp;<\/span> (.+)/;
      const [match, parsedUsername, parsedMessage] = data.match(pattern);

      // tagged message
      if (hasUsernameTag(parsedMessage)) {

        const taggedUsernames = extractUsernames(parsedMessage);

        // if message is tagged to user - highlight the whole message for tagged users
        if (taggedUsernames.includes(username)) {
          chatBox.innerHTML += `<div class="send-message tagged-message"><span class="username">${parsedUsername} : &nbsp;</span>${replaceUsernameTags(parsedMessage)} </div>`;
        }

        // if message is tagged to another client - highlight tags
        else if (clients.some(item => taggedUsernames.includes(item))) {
          chatBox.innerHTML += `<div class="send-message"><span class="username">${parsedUsername} : &nbsp;</span>${replaceUsernameTags(parsedMessage)} </div>`;
        }

        // bots
        else if (clients.some(item => taggedUsernames.includes(item))) {
          // calculator bot
          if (parsedMessage.startsWith('@calculator')) {
            await calculator(parsedMessage, parsedUsername, data);
          }

          // translator bot
          else if (parsedMessage.startsWith('@translator')) {
            await translator(parsedMessage, parsedUsername);
          }

          // compiler bot
          else if (parsedMessage.startsWith('@compiler')) {
            await compiler(parsedMessage, parsedUsername);
          }

          // helper bot (local scoped)

        }

        // normal message
        else {
          chatBox.innerHTML += `<div class="send-message"><span class="username">${parsedUsername} : &nbsp;</span>${parsedMessage}</div>`;
        }

        // reset string
        string = '@'

        // render new clients list 
        renderList(allClients);

      }

      // code box
      else if (parsedMessage.startsWith("```") && parsedMessage.endsWith("```")) {
        await codeBox(parsedMessage, parsedUsername)
      }

      // normal message
      else {

        // update message
        chatBox.innerHTML += `<div class="send-message">${data}</div>`;
      }

      playNotificationSfx();
    }

    scrollToBottom(); // scroll to bottom when new message is received
  });

  reader.readAsText(event.data);
}

async function sendMessage() {

  // if decryption key is valid
  if (validKey && allowSentMessage) {
    // get the message from user
    let message = document.getElementById("input-send-message").value;

    // trim starting and ending blank new lines
    message = message.trimStart();
    message = message.trimEnd();

    message = await stringifyHTML(message);

    // replace new line (\n) with <br>
    message = message.replace(/(?:\r\n|\r|\n)/g, '<br>');

    // ignore the help bot message to be send 
    if (message.startsWith("@help")) {
      await help(message, username)
    }
    // handle normal message
    else if (message != "") {
      // sent encrypted message to socket server
      socket.send(
        encrypt(
          `<span class="username">${username} : &nbsp;</span> ${message}`,
          key
        )
      );

    }
  }

  // clear the input when message is send
  document.getElementById("input-send-message").value = "";
}