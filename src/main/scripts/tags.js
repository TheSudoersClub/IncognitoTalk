//nicknames array
// let nickNames = ["ram", "shriram", "rahul"];
// let nickNames = []

//container
// let tagContainer = document.querySelector('.tags');


// document.querySelector('#input-send-message').addEventListener('keydown', function (e) {
//     if (nickNames.length != 0 && e.key === '@') {
//         renderClientsList();
//         tagContainer.style.display = "flex"
//         sortClientList();
//     } else if (e.key === ' ' || e.key === "Enter") {
//         tagContainer.style.display = "none"
//     }
// })

// function renderClientsList() {
//     nickNames.forEach(element => {
//         let tagElement = document.createElement("span");
//         tagElement.innerText = element;
//         tagContainer.appendChild(tagElement);
//     });
// }

// function sortClientList(e) {
//     let string = '@';
//     document.querySelector('#input-send-message').addEventListener('keydown', function (e) {
//         string = string + e.key;
//         string = string.replace("@", "");
//         renderClientsListSorted(string);
//     })
// }

// function renderClientsListSorted(e) {
//     tagContainer.innerHTML = "";
//     let tagElement = document.createElement("span");
//     tagElement.innerText = searchArray(e);
//     tagContainer.appendChild(tagElement);
// }

// function searchArray(searchTerm) {
//     return nickNames.filter(item => item.startsWith(searchTerm));
// }

let nickNames = ["ram", "shriram", "rahul"];
let nickNamesFiltered = [];
let tagTriggered = false;
let string = '@';
let inputField = document.querySelector('#input-send-message');
renderList(nickNames);

inputField.addEventListener('keydown', function (e) {
    let wrapper = document.querySelector('.tag-elements-wrapper');
    if (nickNames.length != 0 && e.key === '@') {
        wrapper.style.display = "flex"
        tagTriggered = true;
    } else if (e.key === ' ' || e.key === "Enter") {
        wrapper.style.display = "none"
        tagTriggered = false;
    }

    if (tagTriggered) {
        string = string + e.key;
        string = string.replace("@", "");
        console.log(string);

        nickNames.forEach(element => {
            if (element.startsWith(string)) {
                nickNamesFiltered.push(element);
                filterUnique(nickNamesFiltered, string);
            }
        });
    }
})

function filterUnique(array, string) {
    let newArr = [];
    array.forEach(element => {
        if (element.startsWith(string))
            newArr.push(element);
    });
    let nickNamesFIlteredUnique = [...new Set(newArr)];
    renderList(nickNamesFIlteredUnique);
}

function renderList(array) {
    let container = document.querySelector('#tags');
    container.innerHTML = '';

    array.forEach(element => {
        let tagElement = document.createElement("li");
        tagElement.innerText = element;
        container.appendChild(tagElement);
    });
}