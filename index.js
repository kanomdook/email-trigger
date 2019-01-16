const express = require('express');
const http = require('http');
var _gmail = require('./gmail.js');
// const path = require('path');

const app = express();

// app.use(express.static(path.join(__dirname, 'dist')));

// app.get('*', (req, res) => {
//     console.log({
//         status: 200,
//         data: 'ok'
//     });
//     res.sendFile(path.join(__dirname, 'dist/index.html'));
// });

app.get('/', (req, res) => {
    res.json({
        success: true,
        data: 'hello api'
    });
});

app.get('/api/line', (req, res) => {
    _gmail.send({
        code: 'code'
    });
    res.json();
});

app.post('/api/tigger', (req, res) => {
    console.log('trigger!');
    // _gmail.run();
    _gmail.send(req.body);
    res.json();
});

const port = process.env.PORT || 3000;
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log('running...'));