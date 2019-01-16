const express = require('express');
const http = require('http');
const work = require('./work-flow');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({
        success: true,
        data: 'hello api'
    });
});

app.post('/api/tigger', (req, res) => {
    new work(req, res);
});

const port = process.env.PORT || 3000;
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log('running...'));