'use strict';

const res = require("express/lib/response");
const { json } = require("express/lib/response");

(function() {
    let resultarea;
    let inputfield;

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        resultarea = document.getElementById('resultarea');
        inputfield = document.getElementById('number');
        document.getElementById('submit').addEventListener('click', send);
    }

    async function send() {
        clearMessagearea();
        resultarea.innerHTML = '';
        const number = inputfield.value;
        try {
            const options = {
                method: 'POST',
                body: JSON.stringify({number}),
                headers: {
                    'Content-Type':'application/json'
                }
            };
            const data = await fetch('/getOne', options);
            const resultJson = await data.json();

            updatePage(resultJson);
        }
        catch(error) {
            updateMessagearea(error.message, 'error');
        }
    }

    function updatePage(result) {
        if(result) {
            if(result.message) {
                updateMessagearea(result.message, result.type)
            }
            else {
                updateCat(result);
            }
        }
        else {
            updateMessagearea('Not found', 'error');
        }
    }

    function updateCat(cat) {
        resultarea.innerHTML = `
        <p><span class="legend">Number:</span> ${cat.number}</p>
        <p><span class="legend">Name:</span> ${cat.name}</p>
        <p><span class="legend">Length:</span> ${cat.length}</p>
        <p><span class="legend">Weight Kg:</span> ${cat.weightKg}</p>
        <p><span class="legend">Breed:</span> ${cat.breed}</p>
        `;
    }
})();