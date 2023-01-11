const {
    exec
} = require('child_process');


// start server for home page
exec('cd IncognitoTalk/server/home/ && ./home-server-linux', (error, stdout, stderr) => {
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