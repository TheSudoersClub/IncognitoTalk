// invite link
let inviteLink;

//onclick create room
document
  .getElementById("choice-btn-create")
  .addEventListener("click", function () {
    document.querySelector(".choice").style.display = "none";

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      document.querySelector(".create-room-prompt-mobile").style.display =
        "block";
    } else {
      fetch("http://localhost:7771/execute-file", {
        method: "POST",
      });

      fetch("http://localhost:7771/execute-file")
        .then((response) => response.text())
        .then((link) => {
          inviteLink = link;
          // console.log(`Invite link: http://${inviteLink}`);
          // alert(inviteLink);
        });
      document.querySelector(".create-room-prompt").style.display = "block";
      document.querySelector(".processing_animation").style.display = "block";
      displayInviteLink();
    }
  });

// onclick join room
document
  .querySelector("#choice-btn-join")
  .addEventListener("click", function (e) {
    document.querySelector(".choice").style.display = "none";
    document.querySelector(".join-link-prompt").style.display = "block";
  });

document
  .querySelector("#input-join-link-prompt")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      document.querySelector(".join-link-prompt").style.display = "none";
      let container = (document.querySelector(".container").style.display =
        "block");

      let inviteLink = document.getElementById("input-join-link-prompt").value;
      window.open(inviteLink, "_self");
    }
  });

async function displayInviteLink() {
  await sleep(10);
  document.querySelector(".processing_animation").style.display = "none";
  document.getElementById("invite-link").innerHTML = "http://" + inviteLink;
  document.querySelector(".generate-invite-link").style.display = "block";
}

//copylink
function copyToClipboard(id) {
  let value = document.getElementById(id).innerHTML;
  navigator.clipboard.writeText(value);
  document.querySelector(".copied-message").style.display = "block";
}

async function copyToClipboardAndroid(id) {
  let value = document.getElementById(id).innerHTML;
  value = $("<textarea />").html(value).text();

  let tempInput = document.createElement("input");
  tempInput.style = "position: absolute; left: -1000px; top: -1000px";
  tempInput.value = value;

  document.body.appendChild(tempInput);

  tempInput.select();

  document.execCommand("copy");
  document.body.removeChild(tempInput);

  document.querySelector("#create-room-android-copy-button").innerHTML =
    "Copied";

  setTimeout(() => {
    document.querySelector(".create-room-prompt-mobile").style.display = "none";
    document.querySelector(".join-link-prompt").style.display = "block";
  }, 5000);
}

//join hosted room
function joinRoom() {
  window.open(`http://${inviteLink}`, "_self");
}

async function sleep(s) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}