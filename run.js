const {
    exec
} = require('child_process');


// start server for home page
exec('cd src/server/home/ && node home-server.js', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error}`);
        return;
    }
    console.log(`Output: ${stdout}`);
});
// start app 
exec('open http://localhost:7771', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error}`);
        return;
    }
    console.log(`Output: ${stdout}`);

});
setTimeout(() => {
    console.log("running...")
}, 2000);