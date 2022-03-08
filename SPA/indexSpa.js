'use strict';

const http = require('http');
const path = require('path');
const fetch = require('./fetchLib');
const express = require ('express');
const app = express();
const { port, host } = require('./configSpa.json');
const server = http.createServer(app);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'menu.html')));

app.get('/getAll', (req, res) => {
    fetch('http://localhost:4000/api/cats', {mode: 'cors'})
    .then(data => data.json())
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

app.post('/getOne', (req, res) => {
    const catNumber = req.body.number;

    console.log(req.body);
    if(catNumber && catNumber.length>0) {
        fetch(`http://localhost:4000/api/cats/${catNumber}`, {mode: 'cors'})
        .then(data => data.json())
        .then(result => res.json(result))
        .catch(err => res.json(err));
    }
    else {
        res.json({message:'empty number', type:'error'});
    }
});

app.post('/add', (req, res) => {
    const cat = req.body;
    const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cat)
    };

    fetch ('http://localhost:4000/api/cats', options)
        .then(data => data.json())
        .then(result => res.json(result))
        .catch(err => res.json(err));
});

app.post('/update', (req, res) => {
    const cat = req.body;
    const options = {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cat)
    };

    fetch(`http://localhost:4000/api/cats/${cat.number}`, options)
        .then(data => data.json())
        .then(result => res.json(result))
        .catch(err => res.json(err));
});

app.post('/remove', (req, res) => {
    const catNumber = req.body.number;

    console.log(req.body);
    if(catNumber && catNumber.length>0) {
        fetch(`http://localhost:4000/api/cats/${catNumber}`, 
        {method: 'DELETE', mode:'cors'})
        .then(data => data.json())
        .then(result => res.json(result))
        .err(err => res.json(err));
    }
    else {
        res.json({message:'empty number', type:'error'});
    }
});

app.all('*', (req, res) => res.json('not supported'));

server.listen(port, host, () => console.log(`Server ${host}:${port} is running...`))