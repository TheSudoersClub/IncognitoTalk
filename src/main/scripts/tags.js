let nickNames = ["ram", "shriram", "rahul"];
let nickNamesFiltered = [];
let tagTriggered = false;
let addToValue = false;
let string = '@';
let inputField = document.querySelector('#input-send-message');
let container = document.querySelector('#tags');

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
        if (e.key === 'Backspace') {
            string = string.slice(0, -1);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            inputField.value = '@' + container.firstChild.innerText;
        }
        else {
            string = string + e.key;
        }
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
        if (element.startsWith(string)) {
            newArr.push(element);
        }
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