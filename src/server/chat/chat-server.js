const http = require('http');
const fs = require('fs');
const {
    exec
} = require('child_process');
const crypto = require('crypto');
const fs = require('fs');


// General

// generate the encryption-decryption key
let key = "IT-" + crypto.randomBytes(4).toString('hex').slice(0, 8);

// save the key in file key.txt
fs.writeFile('key.txt', (key), (err) => {
    if (err) throw err;
});

http.createServer(function (request, response) {
    if (request.url === '/') {
        fs.readFile('../../main/chat.html', function (err, data) {
            if (err) {
                response.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                response.end('Error loading chat.html');
            } else {
                response.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                response.end(data);
            }
        });
    } //
    else if (request.url.endsWith('.css')) {
        fs.readFile(`../../main/${request.url}`, function (err, data) {
            if (err) {
                response.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                response.end('Error loading css file');
            } else {
                response.writeHead(200, {
                    'Content-Type': 'text/css'
                });
                response.end(data);
            }
        });
    } //
    else if (request.url.endsWith('.js')) {
        fs.readFile(`../../main/${request.url}`, function (err, data) {
            if (err) {
                response.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                response.end('Error loading js file');
            } else {
                response.writeHead(200, {
                    'Content-Type': 'application/javascript'
                });
                response.end(data);
            }
        });
    }
}).listen(7773);