const {
    exec
} = require('child_process');


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
    console.log("running...")
}, 2000);