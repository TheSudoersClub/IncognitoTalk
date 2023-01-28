// Read and handle the decryption key
let validKey;


async function validateKey(key) {
    // hash the entered key
    const hash = CryptoJS.SHA256(key).toString();

    try {
        const response = await fetch(`${window.location.href}compare-hash`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                hash: hash,
            }),
        });

        const data = await response.json();
        if (data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
    }
}

function encrypt(string, key) {
    return CryptoJS.AES.encrypt(string, key).toString();
}

function decrypt(string, key) {
    return CryptoJS.AES.decrypt(string, key).toString(CryptoJS.enc.Utf8);
}