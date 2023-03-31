const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const fs = require('fs');
const html = fs.readFileSync('./index.html', 'utf8');

app.get('/', (req, res) => {
  // res.sendFile(__dirname + '/index.html');

  res.writeHead(200, {'Content-Type': 'text/html','Content-Length':html.length});
  res.write(html);
  res.end();
});

io.on('connection', (socket) => {  

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });

  socket.on('clientPush', (clientPush) => {

    socket.on(clientPush.namespace, (msg)=> {
      console.log(`channel ${clientPush.namespace} created`);    
      console.log(`channel ${clientPush.namespace} ${msg}`);
      io.emit(clientPush.namespace, {
        mocos: msg
      });
    });

    io.emit(clientPush.namespace, 0);

  });

  socket.broadcast.emit('welcome', 'mocos');

});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});