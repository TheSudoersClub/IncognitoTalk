// file handling
const fs = require('fs');

// security -encryption
const CryptoJS = require('crypto-js');

// server and endpoints
const express = require('express');
const app = express();
const server = require('http').createServer(app);

// socket-server
const WebSocket = require("ws"); // Import the `ws` module
const wss = new WebSocket.Server({
  // create a new WebSocket server
  server,
  path: '/socket'
});

// set server status
fs.writeFile('../socket/serverStatus.txt', ("server-opened"), (err) => {
  if (err) throw err;
});

const clients = []; // Create an array to store connected clients

let nicknames = []; // array on nicknames of joined clients to server 

let bots = ["calculator", "translator", "compiler"] // array of server bots


// handle websocket 
wss.on("connection", (ws) => {
  // When a new client connects
  console.log("client connected");
  clients.push(ws); // Add the client to the array

  ws.on("message", async (message) => {

    // When the server receives a message from the client
    for (const client of clients) {

      // Loop through all the clients
      client.send(message); // Send the message to each client

      // update the nicknames array 
      await updateNicknames(message);

      console.log(nicknames);

    }
  });

  ws.on("close", () => {
    // When the client closes the connection
    console.log("client disconnected");
    const index = clients.indexOf(ws); // Find the index of the client in the array
    clients.splice(index, 1); // Remove the client from the array
  });
});


// handle routes
app.use((req, res, next) => {

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Serve static files from the 'public' directory
app.use(express.static('../../main'));

// host client 
app.get('/', (req, res) => {
  // validate server status 
  const serverStatus = fs.readFileSync('serverStatus.txt', 'utf8').toString(); // the decryption key of server 

  // if server status is closed
  if (serverStatus == 'server-closed') {
    fs.readFile('../../main/error.html', function (err, data) {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end('Error loading chat.html');
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
        res.end(data);
      }
    });
  }

  // if server status is opened
  else {
    fs.readFile('../../main/chat.html', function (err, data) {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end('Error loading chat.html');
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
        res.end(data);
      }
    });
  }
})

// end point for nicknames 
app.get('/compare-hash', (req, res) => {
  // get the real hash
  let serverHash = fs.readFileSync('encrypted-key.txt', 'utf8').toString();

  // get the client hash
  let clientHash = decodeURIComponent(req.query.hash);

  // if hash is matched then sent success (true)
  if (clientHash === serverHash) {
    res.send(JSON.stringify({
      success: true
    }));
  }
  // if hash is not matched then send !success (false)
  else {
    res.send(JSON.stringify({
      success: false
    }));
  }
});

// end point for nicknames 
app.get('/clients-joined', (req, res) => {
  res.send(JSON.stringify(nicknames));
});

// end point for bots 
app.get('/bots', (req, res) => {
  res.send(JSON.stringify(bots));
});

// update nicknames array when client is left and joined 
async function updateNicknames(message) {

  // get the decryption key of server 
  let decryptionKey = fs.readFileSync('key.txt', 'utf8');

  // decode the message to string
  let decodedMessage = Buffer.from(message, 'hex').toString();

  // decrypt the decoded message with decryption key
  let decryptedMessage = CryptoJS.AES.decrypt(decodedMessage, decryptionKey).toString(CryptoJS.enc.Utf8);


  // for user joined 
  if (decryptedMessage.startsWith("USER_JOINED: ")) {

    // get the nickname of user
    const nickname = decryptedMessage.slice("USER_JOINED: ".length);

    // update nicknames array (add nickname of new client)
    nicknames.push(nickname);


  }

  // for user left
  else if (decryptedMessage.startsWith("USER_LEFT: ")) {

    // get the nickname of user
    const nickname = decryptedMessage.slice("USER_LEFT: ".length);

    // update nicknames array (delete the nickname)
    nicknames = nicknames.filter(nicknames => nicknames !== nickname);

  }

  // remove all duplicate nicknames 
  nicknames = [...new Set(nicknames)];
}

// listen on port 7772 (socket-server-port)
server.listen(7772, () => {
  console.log("Server started on http://localhost:7772");
});