// calculator bot
async function calculator(parsedMessage, parsedUsername, data, ) {
    let expression = await parsedMessage.replace(/^@\S+\s/, "");
    const chatBox = document.getElementById("chats");
    fetch(`https://incognitotalk-bots.onrender.com/calculate?expression=${encodeURIComponent(expression)}`)
      .then(response => response.text())
      .then(data => {
        chatBox.innerHTML += `<div class="send-message"><span class="username">${parsedUsername} : &nbsp;</span>${parsedMessage} </div>`;
        chatBox.innerHTML += `<div class="send-message"><span class="username">Calculator : &nbsp;</span>${data} </div>`;
        scrollToBottom();
      })
      .catch(error => console.error(error));
  }