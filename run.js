const {
    exec
} = require('child_process');

const os = require('os');
const platform = os.platform();


// windows
if (platform === 'win32') {
    // Todo
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
        console.log(`Output: ${stdout}`);
    });
    // start app 
    exec('build/home/inct-app-linux-x64/inct-app', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return;
        }
        console.log(`Output: ${stdout}`);

    });
    setTimeout(() => {

    }, 2000);
}

// OS X
else if (platform === 'darwin') {
    // Todo
}