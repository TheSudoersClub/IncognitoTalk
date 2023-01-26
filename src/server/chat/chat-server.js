const http = require('http');
const fs = require('fs');
const {
    exec
} = require('child_process');


http.createServer(function (request, response) {

    // Set CORS headers
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

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
    }

    // load css
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
    }

    // load javascript
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

    // compare hash
    else if (request.url === '/compare-hash') {
        let body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            // get the real hash
            let serverHash = fs.readFileSync('key.txt', 'utf8').toString();

            // get the client hash
            let clientHash = JSON.parse(body).hash;

            // if hash is matched then sent success (true)
            if (clientHash === serverHash) {
                response.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                response.end(JSON.stringify({
                    success: true
                }));
            }
            // if hash is not matched then send !success (false)
            else {
                response.writeHead(401, {
                    'Content-Type': 'application/json'
                });
                response.end(JSON.stringify({
                    success: false
                }));
            }
        });
    }


}).listen(7773);