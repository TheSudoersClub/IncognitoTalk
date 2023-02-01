// onclick join room
document
    .querySelector("#choice-btn-stop")
    .addEventListener("click", function (e) {
        fetch("http://localhost:7771/reject-clients");
        console.log('server stopped')
    });