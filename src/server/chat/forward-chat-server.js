const {
    exec
} = require('child_process');
const os = require('os');
const platform = os.platform();


// windows
if (platform === 'win32') {
    // Todo
}

// linux
else if (platform === 'linux') {

    let bore = '../port-forwarding-service/bore'

    // prot forwarding
    exec(`${bore} local 7773 --to bore.pub > log.txt`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return;
        }
        console.log(`Output: ${stdout}`);
    });

    // after 3 seconds run above command 
    setTimeout(() => {
        exec(`echo $(cat log.txt) | grep -o -P 'bore.pub.{0,6}' > link.txt`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                return;
            }
            console.log(`Output: ${stdout}`);
        });

        // after 2 seconds run above command 
        setTimeout(() => {
            exec(`echo $(cat link.txt | grep -o -P 'bore.pub:.{0,6}') > link.txt`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error}`);
                    return;
                }
                console.log(`Output: ${stdout}`);
            });

        }, 2000);

    }, 3000);
}

// OS X
else if (platform === 'darwin') {
    // Todo
}