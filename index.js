const express = require('express');
const http = require('http');
const path = require('path');

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

app.get('/api/tigger', (req, res) => {
    res.json({
        success: true,
        data: 'trigger!'
    });
});

const port = process.env.PORT || 3000;
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log('running...'));