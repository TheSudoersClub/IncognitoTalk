// clients joined in chat 
let clients = [];

async function updateClients() {
    // get the usernames of joined clients 
    const response = await fetch(`/clients-joined`)
    const data = await response.json()
    return data
}

// server bots
let bots = [];

async function getBots() {
    // get the usernames of joined clients 
    const response = await fetch(`/bots`)
    const data = await response.json()
    return data
}