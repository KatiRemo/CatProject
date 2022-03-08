'use strict';

(function() {
    let numberField;
    let nameField;
    let lengthField;
    let weightKgField;
    let breedField;

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        numberField = document.getElementById('number');
        nameField = document.getElementById('name');
        lengthField = document.getElementById('length');
        weightKgField = document.getElementById('weightKg');
        breedField = document.getElementById('breed');

        document.getElementById('submit').addEventListener('click', send);
    }

    async function send() {
        clearMessagearea();
        const cat = {
            number: numberField.value,
            name: nameField.value,
            length: lengthField.value,
            weightKg: weightKgField.value,
            breed: breedField.value
        };

        try {
            const options = {
                method: 'POST',
                body: JSON.stringify(cat),
                headers: {
                    'Content-Type':'application/json'
                }
            };

            const data = await fetch('/add', options);
            const resultJson = await data.json();
            if(resultJson.message) {
                updateMessagearea(resultJson.message, resultJson.type);
            }
        }
        catch(error) {
            updateMessagearea(error.message, 'error');
        }
    }
})();