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