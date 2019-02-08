let express = require('express');
let http = require('http');
let path = require('path');

let app = express();

const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'dist', 'UniversityCRMfront')));

app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));

const server = http.createServer(app);

server.listen(port, () => {console.log('Angular is listening...')});


