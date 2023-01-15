const {
    exec
} = require('child_process');
const os = require('os');
const platform = os.platform();


// windows
if (platform === 'win32') {
    let bore = '..\\port-forwarding-service\\bore.exe'

    // prot forwarding
    exec(`${bore} local 7772 --to bore.pub > log.txt`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return;
        }
        console.log(`Output: ${stdout}`);
    });

    // after 5 seconds run above command 
    setTimeout(() => {
        exec(`powershell -Command "(Select-String -Path log.txt -Pattern 'bore.pub:[0-9]{5}' -AllMatches).Matches.Value | Out-File link.txt"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                return;
            }
            console.log(`Output: ${stdout}`);
        });

        // after 2 seconds run above command 
        setTimeout(() => {
            
            // after 2 seconds run above command 
            setTimeout(() => {
                // change the server url in client.js file with sed command
                exec(`.\\sed.bat`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error: ${error}`);
                        return;
                    }
                    console.log(`Output: ${stdout}`);
                });
            }, 1000);

        }, 3000);

    }, 3000);
}

// linux
else if (platform === 'linux') {

    let bore = '../port-forwarding-service/bore'

    // prot forwarding
    exec(`${bore} local 7772 --to bore.pub > log.txt`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return;
        }
        console.log(`Output: ${stdout}`);
    });

    // after 5 seconds run above command 
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

            // after 2 seconds run above command 
            setTimeout(() => {
                // change the server url in client.js file with sed command
                exec(`sed -i "s|socketLink = '.*'|socketLink = '$(cat link.txt)'|" ../../main/scripts/client.js`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error: ${error}`);
                        return;
                    }
                    console.log(`Output: ${stdout}`);
                });
            }, 1000);

        }, 3000);

    }, 3000);
}

// OS X
else if (platform === 'darwin') {
    // Todo 
}