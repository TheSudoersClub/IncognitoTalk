const WebSocket = require("ws"); // Import the `ws` module
const fs = require('fs');

const CryptoJS = require('crypto-js');

const express = require('express');
const app = express();
const server = require('http').createServer(app);

const wss = new WebSocket.Server({
  // create a new WebSocket server
  server,
  path: '/socket'
});

const clients = []; // Create an array to store connected clients

let nicknames = []; // array on nicknames of joined clients to server 

let bots = ["calculator", "translator", "compiler"] // array of server bots

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

app.use((req, res, next) => {

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});


app.use(express.static('../../main')); // Serve static files from the 'public' directory

// host client 
app.get('/', (req, res) => {
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
})

// end point for nicknames 
app.get('/compare-hash', (req, res) => {
  // get the real hash
  let serverHash = fs.readFileSync('encrypted-key.txt', 'utf8').toString();

  // get the client hash
  let clientHash = decodeURIComponent(req.query.hash);

  console.log(clientHash, serverHash);

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
  let decryptionKey = fs.readFileSync('key.txt', 'utf8').toString();

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

  console.log(typeof (nicknames))

}


// listen on port 7772 (socket-server-port)
server.listen(7772, () => {
  console.log("Server started on http://localhost:7772");
});