// hide other divs onload
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".join-link-prompt").style.display = "none";
  document.querySelector(".create-room-prompt").style.display = "none";
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

// onclick crete room
document
  .querySelector("#choice-btn-create")
  .addEventListener("click", function (e) {
    document.querySelector(".choice").style.display = "none";
    document.querySelector(".create-room-prompt").style.display = "block";
  });

document
  .querySelector("#input-crete-room-prompt")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      document.querySelector(".create-room-prompt").style.display = "none";

      let inviteLink = document.getElementById("input-crete-room-prompt").value;
      window.open(inviteLink, "_self");
    }
  });
