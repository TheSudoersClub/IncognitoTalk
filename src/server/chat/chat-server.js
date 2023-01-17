const http = require('http');
const fs = require('fs');
const {
    exec
} = require('child_process');

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