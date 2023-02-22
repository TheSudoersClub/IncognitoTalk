async function codeBox(parsedMessage, parsedUsername) {
    
    const chatBox = document.getElementById("chats");

    let code = parsedMessage.replace(/```/g, "");

    code = await code.replace(/<br\s*[\/]?>/gi, "\n");

    // wrap message in pre and code elements
    chatBox.innerHTML += `<span class="username">${parsedUsername} : &nbsp;</span><br><pre class="code-block"><code class="language-javascript">${code}</code></pre>`;

    // Add syntax highlighting
    Prism.highlightAll();

}