'use strict';

(function() {
    let numberField;
    let nameField;
    let lengthField;
    let weightKgField;
    let breedField;
    let searchState = true;

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        numberField = document.getElementById('number');
        nameField = document.getElementById('name');
        lengthField = document.getElementById('length');
        weightKgField = document.getElementById('weightKg');
        breedField = document.getElementById('breed');

        updateFields();

        document.getElementById('submit').addEventListener('click', send);

        numberField.addEventListener('focus', clearAll);
    }

    function clearAll() {
        if(searchState) {
            clearFieldValues();
            clearMessagearea();
        }
    }

    function updateFields() {
        if(searchState) {
            numberField.removeAttribute('readonly');
            nameField.setAttribute('readonly', true);
            lengthField.setAttribute('readonly', true);
            weightKgField.setAttribute('readonly', true);
            breedField.setAttribute('readonly', true);
        }
        else {
            numberField.setAttribute('readonly', true);
            nameField.removeAttribute('readonly');
            lengthField.removeAttribute('readonly');
            weightKgField.removeAttribute('readonly');
            breedField.removeAttribute('readonly');
        }
    }

    function updateCatValue(cat) {
        numberField.value = cat.number;
        nameField.value = cat.name;
        lengthField.value = cat['length'];
        weightKgField.value = cat.weightKg;
        breedField.value = cat.breed;
        searchState = false;
        updateFields();
    }

    function clearFieldValues() {
        numberField.value = '';
        nameField.value = '';
        lengthField.value = '';
        weightKgField.value = '';
        breedField.value = '';
        searchState = true;
        updateFields();
    }

    async function send() {
        try {
            if(searchState) {
                clearMessagearea();
                const number = numberField.value;
                const options = {
                    method: 'POST',
                    body: JSON.stringify({number}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                const data = await fetch('/getOne', options);
                const getResult = await data.json();
                console.log(getResult);
                if(getResult) {
                    if(getResult.message) {
                        updateMessagearea(getResult.message, getResult.type);
                    }
                    else {
                        updateCatValue(getResult);
                    }
                }
                else {
                    updateMessagearea('Not found', 'error');
                }
            }
            else {
                const cat = {
                    number: +numberField.value,
                    name: nameField.value,
                    length: +lengthField.value,
                    weightKg: +weightKgField.value,
                    breed: breedField.value
                };
                const options = {
                    method: 'POST',
                    body: JSON.stringify(cat),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                const data = await fetch('/update', options);
                const resultJson = await data.json();

                if(resultJson.message) {
                    updateMessagearea(resultJson.message, resultJson.type);
                }
                searchState = true;
                updateFields();
            }
        }
        catch(error) {
            updateMessagearea(error.message, 'error');
        }
    }
})();
