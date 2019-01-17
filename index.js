const express = require('express');
const http = require('http');
const work = require('./work-flow');
const gmail = require('./gmail');
// const _gmail = require('./_gmail');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({
        success: true,
        data: 'hello api'
    });
});

app.post('/api/tigger', (req, res) => {
    const gr = new gmail();
    gr.then(detail => {
        new work(req, res, detail);
    }).catch(err => {
        res.json({
            success: false,
            msg: 'can not get gmail ! : ' + err
        });
    });

    // ****** for get access_token ********
    // _gmail.run();
});

const port = process.env.PORT || 3000;
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log('running...'));