const {
    exec
} = require('child_process');

// prot forwarding
exec('bore local 7772 --to bore.pub > log.txt', (error, stdout, stderr) => {
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