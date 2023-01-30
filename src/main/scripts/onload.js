window.addEventListener('load', async () => {

    // fetch calculator api initially for faster response on next fetches 
    fetch(`https://incognitotalk-bots.onrender.com/calculate?expression=${encodeURIComponent("1")}`)
        .then(response => response.text())
        .then(data => {
            console.log(data)
        })
        .catch(error => console.error(error));

    // get the previously joined clients 
    clients = await updateClients();

    // get server bots
    bots = await getBots();

    // update allClients array
    allClients = [...clients, ...bots];

    // render new clients list 
    renderList(allClients);
});