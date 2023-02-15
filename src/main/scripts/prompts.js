// Read and handle the nickname
let username;

// the decryption key of the server
let key;


// nickname prompt
document
    .querySelector("#input-nick-name-prompt")
    .addEventListener("keypress", async function (e) {
        if (e.key === "Enter") {
            // get the username
            username = document.getElementById("input-nick-name-prompt").value;

            if (validateUsername(username)) {

                // check weather the same username already exists
                if (allClients.includes(username)) {
                    let errorMsgWrapper = document.querySelector('.nna-error-wrapper')
                    let errorMsg = document.querySelector('#nna-error')
                    errorMsg.innerText = `Nick name ${username} is not available`;

                    errorMsgWrapper.style.animationName = 'shake'
                    errorMsgWrapper.style.display = 'none';
                    errorMsgWrapper.style.display = 'flex';
                }
                // if username is valid and unique
                else {
                    document.querySelector(".nick-name-prompt").style.display = "none";

                    //get decryption key
                    document.querySelector(".decryption-key-prompt").style.display = "flex";

                    // decryption key prompt
                    document
                        .querySelector("#input-decryption-key-prompt")
                        .addEventListener("keypress", async function (e) {
                            if (e.key === "Enter") {
                                key = await document.querySelector("#input-decryption-key-prompt").value;

                                document.querySelector(".decryption-key-prompt").style.display = "none";
                                document.querySelector(".container").style.display = "flex";

                                // validate decryption key
                                validKey = await validateKey(key);

                                if (validKey != undefined) {
                                    initializeWebSocket();
                                }
                            }
                        });
                }
            }
            //
            else {
                console.log("username not allowed");
            }

        }
    });