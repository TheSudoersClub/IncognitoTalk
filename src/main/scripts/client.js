// socket server link
const socketLink = 'bore.pub:43693';

// server bots
let bots = [];

// clients joined in chat 
let clients = [];

// allClients joined in chat inclining bots
let allClients = [];

// the decryption key of the server
let key;

// Read and handle the decryption key
let validKey;

// Read and handle the nickname
let username;

document
  .querySelector("#input-nick-name-prompt")
  .addEventListener("keypress", async function (e) {
    if (e.key === "Enter") {
      // get the username
      username = document.getElementById("input-nick-name-prompt").value;

      // check weather username is valid or not 
      let usernameWords = username.split(" ");

      if (usernameWords.length == 1 && username != '') {

        // get the previously joined clients 
        clients = await updateClients();

        // update allClients array
        allClients = [...clients, ...bots];

        // render new clients list 
        renderList(allClients);


        if (clients.includes(username)) {
          let errorMsgWrapper = document.querySelector('.nna-error-wrapper')
          let errorMsg = document.querySelector('#nna-error')
          errorMsg.innerText = `Nick name ${username} is not available`;
          
          errorMsgWrapper.style.animationName = 'shake'
          errorMsgWrapper.style.display = 'none';
          errorMsgWrapper.style.display = 'flex';
        }
        //
        else {
          document.querySelector(".nick-name-prompt").style.display = "none";

          //get decryption key
          document.querySelector(".decryption-key-prompt").style.display = "flex";
          document
            .querySelector("#input-decryption-key-prompt")
            .addEventListener("keypress", async function (e) {
              if (e.key === "Enter") {
                key = await document.querySelector("#input-decryption-key-prompt").value;

                document.querySelector(".decryption-key-prompt").style.display = "none";
                document.querySelector(".container").style.display = "flex";

                // validate decryption key
                validKey = await validateKey(key);

                if (validKey != undefined) {
                  initializeWebSocket();
                }
              }
            });
        }
      }
      //
      else {
        console.log("username not allowed");
      }

    }
  });


// handle tags 
let allClientsFiltered = [];
let tagTriggered = false;
let addToValue = false;
let string = '@';
let inputField = document.querySelector('#input-send-message');
let container = document.querySelector('#tags');

inputField.addEventListener('keydown', function (e) {
  let wrapper = document.querySelector('.tag-elements-wrapper');
  if (allClients.length != 0 && e.key === '@') {
    wrapper.style.display = "flex"
    tagTriggered = true;

    renderList(allClients);

  } else if (e.key === ' ' || e.key === "Enter") {
    wrapper.style.display = "none"
    tagTriggered = false;
  }

  if (tagTriggered) {
    if (e.key === "Backspace" && e.ctrlKey) {
      string = '@'
    }

    // 
    else if (e.key === 'Backspace') {
      string = string.slice(0, -1);
    }

    //
    else if (e.key === 'Tab') {
      e.preventDefault();

      inputField.value = '@' + container.firstChild.innerText;
    }

    //
    else {
      string = string + e.key;
    }
    string = string.replace("@", "");
    console.log(string);

    allClients.forEach(element => {
      if (element.startsWith(string)) {
        allClientsFiltered.push(element);
        filterUnique(allClientsFiltered, string);
      }
    });
  }
})

// websocket server 
let socket;

async function initializeWebSocket() {
  socket = new WebSocket(`ws://${socketLink}`);

  const chatBox = document.getElementById("chats");

  // get server bots
  bots = await getBots();

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
    socket.onmessage = () => {
      chatBox.innerHTML += `<div class="send-message">message encrypted: invalid decryption key, unable to decrypt the message</div>`;
    };
  }
}

function handleMessage(chatBox) {
  const reader = new FileReader();

  reader.addEventListener("loadend", async (event) => {
    scrollToBottom(); // scroll to bottom when new message is received

    // encrypted data received from server 
    let data = reader.result;

    // decrypt the data received from server with decryption key
    data = decrypt(data, key);

    // "user joined" message
    if (data.startsWith("USER_JOINED: ")) {
      const username = data.slice("USER_JOINED: ".length); // get the username of user

      // update list of joined clients (clients) 
      clients = await updateClients();

      // update allClients array
      allClients = [...clients, ...bots];

      // render new clients list 
      renderList(allClients);

      // update message
      chatBox.innerHTML += `<br><div class="user-joined">${username} joined the chat</div>`;

      playNotificationSfx();
    }

    // "user joined" message
    else if (data.startsWith("USER_LEFT: ")) {
      const username = data.slice("USER_LEFT: ".length); // get the username of user

      // update list of joined clients (clients) 
      clients = await updateClients();

      // update allClients array
      allClients = [...clients, ...bots];

      // render new clients list 
      renderList(allClients);


      // update message
      chatBox.innerHTML += `<br><div class="user-left">${username} left the chat</div>`;
    }

    // regular message
    else {

      // get the normal to check weather the message is tagged or not
      const pattern = /<span class="username">(.+?) : &nbsp;<\/span> (.+)/;
      const [match, parsedUsername, parsedMessage] = data.match(pattern);

      // tagged message
      if (parsedMessage.startsWith("@")) {

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
            let expression = parsedMessage.replace(/^@\S+\s/, "");

            fetch(`https://incognitotalk-bots.onrender.com/calculate?expression=${encodeURIComponent(expression)}`)
              .then(response => response.text())
              .then(data => {
                chatBox.innerHTML += `<div class="send-message"><span class="username">${parsedUsername} : &nbsp;</span>${parsedMessage} </div>`;
                chatBox.innerHTML += `<div class="send-message"><span class="username">Calculator : &nbsp;</span>${data} </div>`;
                scrollToBottom();
              })
              .catch(error => console.error(error));
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

      // normal message
      else {

        // update message
        chatBox.innerHTML += `<div class="send-message">${data}</div>`;
      }

      playNotificationSfx();
    }

  });

  reader.readAsText(event.data);
}

function sendMessage() {
  // if decryption key is valid
  if (validKey) {
    // get the message from user
    const message = document.getElementById("input-send-message").value;

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

async function validateKey(key) {
  // hash the entered key
  const hash = CryptoJS.SHA256(key).toString();

  try {
    const response = await fetch(`${window.location.href}compare-hash`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hash: hash,
      }),
    });

    const data = await response.json();
    if (data.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}

async function updateClients() {
  // get the usernames of joined clients 
  const response = await fetch(`http://${socketLink}/clients-joined`)
  const data = await response.json()
  return data
}

async function getBots() {
  // get the usernames of joined clients 
  const response = await fetch(`http://${socketLink}/bots`)
  const data = await response.json()
  return data
}

function filterUnique(array, string) {
  let newArr = [];
  array.forEach(element => {
    if (element.startsWith(string)) {
      newArr.push(element);
    }
  });
  let allClientsFilteredUnique = [...new Set(newArr)];
  renderList(allClientsFilteredUnique);
}

function renderList(array) {
  let container = document.querySelector('#tags');
  container.innerHTML = '';

  array.forEach(element => {
    let tagElement = document.createElement("li");
    tagElement.innerText = element;
    container.appendChild(tagElement);
  });
}

function encrypt(string, key) {
  return CryptoJS.AES.encrypt(string, key).toString();
}

function decrypt(string, key) {
  return CryptoJS.AES.decrypt(string, key).toString(CryptoJS.enc.Utf8);
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