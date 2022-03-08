'use strict';

(function() {
    let inputField;

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        inputField = document.getElementById('number');

        document.getElementById('submit').addEventListener('click', send);
    }

    async function send() {
        clearMessagearea();
        const number = inputField.value;
        try {
            const options = {
                method: 'POST',
                body: JSON.stringify({number}),
                headers: {
                    'Content-Type':'application/json'
                }
            }
            const data = await fetch('/remove', options);
            const result = await data.json();
            if(result.message) {
                updateMessagearea(result.message, result.type);
            }
        }
        catch(err) {
            updateMessagearea(err.message, 'error');
        }
    }
})();