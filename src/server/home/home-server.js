const http = require('http');
const fs = require('fs');
const os = require('os');
const platform = os.platform();
const {
    exec
} = require('child_process');


http.createServer(function (request, response) {

    // Set CORS headers
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // when create room button is pressed
    if (request.url === '/execute-file') {

        // windows
        if (platform === 'win32') {
            // start socket-server locally
            exec('cd ..\\socket\\ &&  .\\socket-server-win.exe', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error}`);
                    return;
                }

            });

            // forward socket-server port
            exec('cd ..\\socket\\ &&  .\\forward-socket-server-win.exe', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error}`);
                    return;
                }

            });


            // start chat-server locally
            exec('cd ..\\chat\\ &&  .\\chat-server-win.exe', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error}`);
                    return;
                }

            });

            // forward chat-server port
            exec('cd ..\\chat\\ &&  .\\forward-chat-server-win.exe', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error}`);
                    return;
                }

            });

        }

        // linux
        else if (platform === 'linux') {

            // start socket-server locally
            exec('cd ../socket/ &&  ./socket-server-linux', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error}`);
                    return;
                }

            });

            // forward socket-server port
            exec('cd ../socket/ &&  ./forward-socket-server-linux', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error}`);
                    return;
                }

            });


            // start chat-server locally
            exec('cd ../chat/ &&  ./chat-server-linux', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error}`);
                    return;
                }

            });

            // forward chat-server port
            exec('cd ../chat/ &&  ./forward-chat-server-linux', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error}`);
                    return;
                }

            });

        }

        // OS X
        else if (platform === 'darwin') {
            // todo 
        }

    }

    // send Invite link 
    else if (request.url === '/inviteLink') {
        // read invite link and decryption key
        setTimeout(() => {
            fs.readFile('../chat/link.txt', 'utf8', (err, data) => {
                if (err) throw err;

                response.writeHead(200, {
                    'Content-Type': 'text/plain'
                });

                response.end(data);
            });

        }, 8000);
    }

    // send decryption key 
    else if (request.url === '/key') {
        setTimeout(() => {
            fs.readFile('../chat/key.txt', 'utf8', (err, data) => {
                if (err) throw err;

                response.writeHead(200, {
                    'Content-Type': 'text/plain'
                });

                response.end(data);
            });

        }, 8000);
    }
    
    //
    else {
        response.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        response.end('404 Not Found');
    }
}).listen(7771);