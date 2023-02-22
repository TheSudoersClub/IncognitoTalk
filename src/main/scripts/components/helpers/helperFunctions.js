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

function validateUsername(username) {
    // convert username to lower case 
    username = username.toLocaleLowerCase();

    // check for validation
    const regex = /^[a-zA-Z0-9_]+$/; // Regular expression that matches only letters, numbers, and underscores

    // return validation result
    return regex.test(username)
}

// check weather the message contains the tags (@username)
function hasUsernameTag(sentence) {
    // Create a regular expression pattern to match the username tag
    const usernamePattern = /@(\w+)/g;

    // Use the `test` method of the pattern to check if there is at least one match in the input sentence
    const hasMatch = usernamePattern.test(sentence);

    // Return the boolean value indicating whether there is at least one match
    return hasMatch;
}

// get the tags from the message
function extractUsernames(sentence) {
    // Create a regular expression pattern to match the username tag
    const usernamePattern = /@(\w+)/g;

    // Use the `matchAll` method of the input sentence to find all instances of the username tag
    const matches = sentence.matchAll(usernamePattern);

    // Map the matches to an array of usernames
    const usernames = [...matches].map(match => match[1]);

    // Return the array of usernames
    return usernames;
}

// replace the @username with span tag
function replaceUsernameTags(sentence) {
    // Create a regular expression pattern to match the username tag
    const usernamePattern = /@(\w+)/g;

    // Replace all instances of the username tag with the HTML span element
    const replacedSentence = sentence.replace(usernamePattern, '<span class="tagged">@$1</span>');

    // Return the replaced sentence
    return replacedSentence;
}