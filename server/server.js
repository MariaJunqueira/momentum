const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('A new client connected');
  ws.send(JSON.stringify({ type: 'system', message: 'Welcome to the WebSocket server!' }));

  ws.on('message', function incoming(message) {
    try {
      const parsedMessage = JSON.parse(message);
      ws.send(JSON.stringify({ type: 'response', content: `You sent: ${parsedMessage.content}` }));
    } catch (error) {
      console.error('Invalid JSON:', message);
    }
  });

  ws.on('close', function close() {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
