const WebSocket = require("ws"); // Import the `ws` module
const fs = require('fs');
const CryptoJS = require('crypto-js');


const wss = new WebSocket.Server({
  // Create a new WebSocket server
  port: 7772, // Listen on port 77725
});

const clients = []; // Create an array to store connected clients

let nicknames = [];

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

console.log("listening on 0.0.0.0:7772");

async function updateNicknames(message) {
  let decryptionKey = fs.readFileSync('../chat/key.txt', 'utf8').toString();
  let decodedMessage = Buffer.from(message, 'hex').toString();
  let decryptedMessage = CryptoJS.AES.decrypt(decodedMessage, decryptionKey).toString(CryptoJS.enc.Utf8);

  if (decryptedMessage.startsWith("USER_JOINED: ")) {

    const nickname = decryptedMessage.slice("USER_JOINED: ".length);

    nicknames.push(nickname);


  } else if (decryptedMessage.startsWith("USER_LEFT: ")) {

    const nickname = decryptedMessage.slice("USER_LEFT: ".length);

    nicknames = nicknames.filter(nicknames => nicknames !== nickname);

  }

  // remove all duplicate nicknames 
  nicknames = [...new Set(nicknames)];


  // to do - create end point for nicknames 

}