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


    if (request.url === '/execute-file') {
        // when create room button is pressed

        // start socket-server locally
        exec('cd ../socket/ &&  ./socket-server-linux', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                return;
            }
            console.log(`Output: ${stdout}`);

        });

        // forward socket-server port
        exec('cd ../socket/ &&  ./forward-socket-server-linux', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                return;
            }
            console.log(`Output: ${stdout}`);

        });


        // start chat-server locally
        exec('cd ../chat/ &&  ./chat-server-linux', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                return;
            }
            console.log(`Output: ${stdout}`);

        });

        // forward chat-server port
        exec('cd ../chat/ &&  ./forward-chat-server-linux', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                return;
            }
            console.log(`Output: ${stdout}`);

        });


        // read invite link
        setTimeout(() => {
            const fs = require('fs');
            fs.readFile('../chat/link.txt', 'utf8', (err, data) => {
                if (err) throw err;

                response.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                response.end(data);

            });
        }, 7000);
    } //
    else {
        response.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        response.end('404 Not Found');
    }
}).listen(7771);