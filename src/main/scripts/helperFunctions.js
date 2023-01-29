async function stringifyHTML(message) {
    // convert html entities present in message
    return await message
        .replace(/&/g, "&amp;")
        .replace(/</g, `&lt;`)
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
        .replace(/¢/g, "&cent;")
        .replace(/£/g, "&pound;")
        .replace(/¥/g, "&yen;")
        .replace(/€/g, "&euro;")
        .replace(/©/g, "&copy;")
        .replace(/®/g, "&reg;")
}

function scrollToBottom() {
    document
        .getElementById("chats")
        .scrollTo(0, document.getElementById("chats").scrollHeight);
}

function playNotificationSfx() {
    var notificationSfx = new Audio("../assets/sfx/notification-sfx-discord.mp3");
    if (document.hidden) {
        notificationSfx.play();
    }
}