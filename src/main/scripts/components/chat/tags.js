// handle tags 
let allClientsFiltered = [];
let tagTriggered = false;
let addToValue = false;
let string = '@';
let inputField = document.querySelector('#input-send-message');
let container = document.querySelector('#tags');

inputField.addEventListener('keydown', function (e) {
    let wrapper = document.querySelector('.tag-elements-wrapper');
    if (allClients.length != 0 && e.key === '@') {
        wrapper.style.display = "flex"
        tagTriggered = true;

        renderList(allClients);

    } else if (e.key === ' ' || e.key === "Enter") {
        wrapper.style.display = "none"
        tagTriggered = false;
    }

    if (tagTriggered) {
        if (e.key === "Backspace" && e.ctrlKey) {
            string = '@'
        }

        // 
        else if (e.key === 'Backspace') {
            string = string.slice(0, -1);
        }

        //
        else if (e.key === 'Tab') {
            e.preventDefault();

            inputField.value = '@' + container.firstChild.innerText;
        }

        //
        else {
            string = string + e.key;
        }
        string = string.replace("@", "");

        allClients.forEach(element => {
            if (element.startsWith(string)) {
                allClientsFiltered.push(element);
                filterUnique(allClientsFiltered, string);
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
    let allClientsFilteredUnique = [...new Set(newArr)];
    renderList(allClientsFilteredUnique);
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