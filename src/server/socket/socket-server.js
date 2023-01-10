const WebSocket = require("ws"); // Import the `ws` module

const wss = new WebSocket.Server({
  // Create a new WebSocket server
  port: 7772, // Listen on port 77725
});

const clients = []; // Create an array to store connected clients

wss.on("connection", (ws) => {
  // When a new client connects
  console.log("client connected");
  clients.push(ws); // Add the client to the array

  ws.on("message", (message) => {
    // When the server receives a message from the client
    for (const client of clients) {
      // Loop through all the clients
      client.send(message); // Send the message to each client
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