'use strict';

function updateMessagearea(message, type) {
    const messagearea = document.getElementById('messagearea');
    messagearea.textContent = message;
    messagearea.setAttribute('class', type);
}

function clearMessagearea() {
    const messagearea = document.getElementById('messagearea');
    messagearea.textContent = '';
    messagearea.removeAttribute('class');
}