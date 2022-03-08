'use strict';

const http = require('http');

const fetch = (uri, fetchOptions) =>
    new Promise((resolve, reject) => {
        const url = new URL(uri);
        const { hostname, port, pathname } = url;

        const options = {
            hostname,
            port,
            path: pathname
        };

        Object.assign(options, fetchOptions);
        
        http.request(options, res => {
            const databuffer = [];

            res.on('data', datachunk => databuffer.push(datachunk));

            res.on('end', () => resolve ({
                json:() => JSON.parse(Buffer.concat(databuffer).toString())
            }))
        })
        .on('error', () => reject('error'))
        .end(options.body);
    });

    module.exports = fetch;