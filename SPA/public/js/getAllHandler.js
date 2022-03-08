'use strict';

(function() {
    document.addEventListener('DOMContentLoaded', init);
    
    async function init() {
        try{
            const data = await fetch ('/getAll');
            const cats = await data.json();
            const resultSet = document.getElementById('resultSet');
            for(let cat of cats) {
                const tr = document.createElement('tr');
                tr.appendChild(createCell(cat.number));
                tr.appendChild(createCell(cat.name));
                tr.appendChild(createCell(cat['length']));
                tr.appendChild(createCell(cat.weightKg));
                tr.appendChild(createCell(cat.breed));
                resultSet.appendChild(tr);
            }
        }
        catch(error) {
            document.getElementById('messagearea').innerHTML =
            `<p class="error">${error.message}</p>`;
        }
    }

    function createCell(data) {
        const td = document.createElement('td');
        td.textContent = data;
        return td;
    }
})();