import express from 'express';
import http from 'http';
import { createWSServer } from './connection';

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('ok');
});

createWSServer(server);

server.listen(5000, () => console.log('listening on port 5000...'));
