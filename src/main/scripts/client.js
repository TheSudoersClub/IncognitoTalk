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
      chatBox.innerHTML += `<div class="send-message">message encrypted: invalid decryption key, unable to decrypt the message</div>`;
    };

    socket.onmessage = () => {
      chatBox.innerHTML += `<div class="send-message">message encrypted: invalid decryption key, unable to decrypt the message</div>`;
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
      if (parsedMessage.startsWith("@")) {

        // remove @ from parsedMessage
        const pattern = /@(\w+)/;
        const match = await parsedMessage.match(pattern);

        // if message is tagged to user
        if (match[1] === username) {
          chatBox.innerHTML += `<div class="send-message tagged-message"><span class="username">${parsedUsername} : &nbsp;</span>${parsedMessage} </div>`;
        }

        // tagged bots 
        else if (bots.includes(match[1])) {

          // calculator bot
          if (match[1] == 'calculator') {
            await calculator(parsedMessage, parsedUsername, data);
          }

          // translator bot
          else if (match[1] == 'translator') {
            await translator(parsedMessage, parsedUsername);
          }

          // compiler bot
          else if (match[1] == 'compiler') {
            await compiler(parsedMessage, parsedUsername);
          }
        }

        // if message is tagged to another client
        else {
          chatBox.innerHTML += `<div class="send-message">${data}</div>`;
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


    if (message != "") {
      // sent encrypted message to socket server
      socket.send(
        encrypt(
          `<span class="username">${username} : &nbsp;</span> ${message}`,
          key
        )
      );

      // clear the input when message is send
      document.getElementById("input-send-message").value = "";
    }
  }
}