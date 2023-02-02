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

            // Generate and handle encryption-decryption key
            exec('cd ..\\socket\\ &&  .\\handleKey-win.exe', (error, stdout, stderr) => {
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


            // Generate and handle encryption-decryption key
            exec('cd ../socket/ &&  ./handleKey-linux', (error, stdout, stderr) => {
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
            fs.readFile('../socket/link.txt', 'utf8', (err, data) => {
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
            fs.readFile('../socket/key.txt', 'utf8', (err, data) => {
                if (err) throw err;

                response.writeHead(200, {
                    'Content-Type': 'text/plain'
                });

                response.end(data);
            });

        }, 8000);
    }

    // stop accepting new client 
    else if (request.url === '/reject-clients') {
        // save the key in file key.txt
        fs.writeFileSync('../socket/serverStatus.txt', ("server-closed"), (err) => {
            if (err) throw err;
        });
        response.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        response.end("server-closed");
    }

    // stop accepting new client 
    else if (request.url === '/accept-clients') {
        // save the key in file key.txt
        fs.writeFileSync('../socket/serverStatus.txt', ("server-opened"), (err) => {
            if (err) throw err;
        });

        response.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        response.end("server-opened");
    }

    //
    else {
        response.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        response.end('404 Not Found');
    }
}).listen(7771);