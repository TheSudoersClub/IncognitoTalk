async function stringifyHTML(message) {
    // convert html entities present in message
    return await new Promise((resolve) => {
        // convert html entities present in message
        resolve(
            message
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
        );
    });
}

async function parseHTML(message) {
    return await new Promise((resolve) => {
        // convert html entities present in message
        resolve(
            message
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, `<`)
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, `"`)
            .replace(/&apos;/g, "'")
            .replace(/&cent;/g, "¢")
            .replace(/&pound;/g, "£")
            .replace(/&yen;/g, "¥")
            .replace(/&euro;/g, "€")
            .replace(/&copy;/g, "©")
            .replace(/&reg;/g, "®")
            .replace(/<br\s*[\/]?>/gi, "\n")
        );
    });
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