"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// file handling
var fs = require('fs'); // security -encryption


var CryptoJS = require('crypto-js'); // server and endpoints


var express = require('express');

var app = express();

var server = require('http').createServer(app); // socket-server


var WebSocket = require("ws"); // Import the `ws` module


var wss = new WebSocket.Server({
  // create a new WebSocket server
  server: server,
  path: '/socket'
}); // set server status

fs.writeFile('../socket/serverStatus.txt', "server-opened", function (err) {
  if (err) throw err;
});
var clients = []; // Create an array to store connected clients

var nicknames = []; // array on nicknames of joined clients to server 

var bots = ["calculator", "translator", "compiler"]; // array of server bots
// handle websocket 

wss.on("connection", function (ws) {
  // When a new client connects
  console.log("client connected");
  clients.push(ws); // Add the client to the array

  ws.on("message", function _callee(message) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, client;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // When the server receives a message from the client
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 3;
            _iterator = clients[Symbol.iterator]();

          case 5:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 14;
              break;
            }

            client = _step.value;
            // Loop through all the clients
            client.send(message); // Send the message to each client
            // update the nicknames array 

            _context.next = 10;
            return regeneratorRuntime.awrap(updateNicknames(message));

          case 10:
            console.log(nicknames);

          case 11:
            _iteratorNormalCompletion = true;
            _context.next = 5;
            break;

          case 14:
            _context.next = 20;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](3);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 20:
            _context.prev = 20;
            _context.prev = 21;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 23:
            _context.prev = 23;

            if (!_didIteratorError) {
              _context.next = 26;
              break;
            }

            throw _iteratorError;

          case 26:
            return _context.finish(23);

          case 27:
            return _context.finish(20);

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[3, 16, 20, 28], [21,, 23, 27]]);
  });
  ws.on("close", function () {
    // When the client closes the connection
    console.log("client disconnected");
    var index = clients.indexOf(ws); // Find the index of the client in the array

    clients.splice(index, 1); // Remove the client from the array
  });
}); // handle routes

app.use(function (req, res, next) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
}); // Serve static files from the 'public' directory

app.use(express["static"]('../../main')); // host client 

app.get('/', function (req, res) {
  // validate server status 
  var serverStatus = fs.readFileSync('serverStatus.txt', 'utf8').toString(); // the decryption key of server 
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
  } // if server status is opened
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
}); // end point for nicknames 

app.get('/compare-hash', function (req, res) {
  // get the real hash
  var serverHash = fs.readFileSync('encrypted-key.txt', 'utf8').toString(); // get the client hash

  var clientHash = decodeURIComponent(req.query.hash); // if hash is matched then sent success (true)

  if (clientHash === serverHash) {
    res.send(JSON.stringify({
      success: true
    }));
  } // if hash is not matched then send !success (false)
  else {
      res.send(JSON.stringify({
        success: false
      }));
    }
}); // end point for nicknames 

app.get('/clients-joined', function (req, res) {
  res.send(JSON.stringify(nicknames));
}); // end point for bots 

app.get('/bots', function (req, res) {
  res.send(JSON.stringify(bots));
}); // update nicknames array when client is left and joined 

function updateNicknames(message) {
  var decryptionKey, decodedMessage, decryptedMessage, nickname, _nickname;

  return regeneratorRuntime.async(function updateNicknames$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // get the decryption key of server 
          decryptionKey = fs.readFileSync('key.txt', 'utf8'); // decode the message to string

          decodedMessage = Buffer.from(message, 'hex').toString(); // decrypt the decoded message with decryption key

          decryptedMessage = CryptoJS.AES.decrypt(decodedMessage, decryptionKey).toString(CryptoJS.enc.Utf8); // for user joined 

          if (decryptedMessage.startsWith("USER_JOINED: ")) {
            // get the nickname of user
            nickname = decryptedMessage.slice("USER_JOINED: ".length); // update nicknames array (add nickname of new client)

            nicknames.push(nickname);
          } // for user left
          else if (decryptedMessage.startsWith("USER_LEFT: ")) {
              // get the nickname of user
              _nickname = decryptedMessage.slice("USER_LEFT: ".length); // update nicknames array (delete the nickname)

              nicknames = nicknames.filter(function (nicknames) {
                return nicknames !== _nickname;
              });
            } // remove all duplicate nicknames 


          nicknames = _toConsumableArray(new Set(nicknames));

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
} // listen on port 7772 (socket-server-port)


server.listen(7772, function () {
  console.log("Server started on http://localhost:7772");
});