document.getElementById("choice-btn-stop").addEventListener('click', function () {
    // get decryption key
    fetch("http://localhost:7771/reject-clients")
        .then((response) => response.text())
        .then((data) => {
            console.log(data);
        });
})

document.getElementById("choice-btn-start").addEventListener('click', function () {
    // get decryption key
    fetch("http://localhost:7771/accept-clients")
        .then((response) => response.text())
        .then((data) => {
            console.log(data);
        });
})