import Koa from 'koa';
import bodyParser from 'koa-body';
import cors from '@koa/cors';
import router from './router';
import log from './log';

const { PORT = 3000 } = process.env;

const app = new Koa();

export default new Promise(resolve => {
  const server = app
    .use(bodyParser())
    .use(router())
    .use(cors())
    .listen(PORT, () => {
      log.success(`Server started on port ${PORT}`); // eslint-disable-line
      resolve(server);
    });
});

// TODO: IMPLEMENT WEB SOCKETS

// const Koa = require('koa');
// const http = require('http');
// const url = require('url');
// const WebSocket = require('ws');

// const app = new Koa();

// app.use(async ctx => {
//   ctx.body = 'Hello World';
// });

// const server = http.createServer(app.callback());
// const wss = new WebSocket.Server({ server });

// wss.on('connection', function connection(ws, req) {
//   const location = url.parse(req.url, true);
//   // You might use location.query.access_token to authenticate or share sessions
//   // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//   });

//   ws.send('something');
// });

// server.listen(8080, function listening() {
//   console.log('Listening on %d', server.address().port);
// });
