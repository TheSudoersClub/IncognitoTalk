const crypto = require('crypto');
const fs = require('fs');

// General

// generate the encryption-decryption key
let key = "IT-" + crypto.randomBytes(4).toString('hex').slice(0, 8);

// save the key in file key.txt
fs.writeFile('key.txt', (key), (err) => {
    if (err) throw err;
});

setTimeout(() => {
    let hash = crypto.createHash('sha256');
    hash.update(key);
    key = hash.digest('hex');

    // update the key with hashed key
    fs.writeFile('key.txt', (key), (err) => {
        if (err) throw err;
    });
}, 10000);