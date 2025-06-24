const express = require('express');
const next = require('next');
const compression = require("compression");

const env = process.env.NODE_ENV;
const dev = env !== 'production';

const port = parseInt(process.env.PORT, 10) || 3000;

const app = next({
    dir: '.', // base directory where everything is
    dev,
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.use(compression());

    // Все запросы обрабатывает Next.js
    server.all('*', (req, res) => handle(req, res));

    server.use(express.json({ limit: '10mb' }));
    server.use(express.urlencoded({ extended: true, limit: '10mb' }));

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('An error occurred, unable to start the server');
    console.error(err);
});
