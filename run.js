const {
    exec
} = require('child_process');

const os = require('os');
const platform = os.platform();


// windows
if (platform === 'win32') {
    console.log(platform)

    // start server for home page
    exec('cd build\\server\\home\\ && .\\home-server-win.exe', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return;
        }
    });
    // start app 
    exec('build\\home\\inct-app-win32-x64\\inct-app.exe', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return;
        }

    });
    setTimeout(() => {

    }, 2000);
}

// Linux
else if (platform === 'linux') {
    console.log(platform)

    // start server for home page
    exec('cd build/server/home/ && ./home-server-linux', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return;
        }
    });
    // start app 
    exec('build/home/inct-app-linux-x64/inct-app', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return;
        }

    });
    setTimeout(() => {

    }, 2000);
}

// OS X
else if (platform === 'darwin') {
    // Todo
}