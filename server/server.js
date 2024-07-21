const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map(); // Map to store client ID and WebSocket connection

wss.on('connection', function connection(ws) {
  console.log('A new client connected');
  
  // Generate a unique ID for each client
  let tempId = Date.now().toString();
  clients.set(tempId, ws);

  // Send a temporary ID to the client
  ws.send(JSON.stringify({ type: 'system', message: 'Welcome to the WebSocket server!', clientId: tempId }));

  ws.on('message', function incoming(message) {
    try {
      const parsedMessage = JSON.parse(message);
      console.log('Received message:', parsedMessage);

      if (parsedMessage.type === 'register') {
        // Handle client ID registration
        const { clientId } = parsedMessage;
        if (clientId && !clients.has(clientId)) {
          // Replace the temporary ID with the registered ID
          clients.delete(tempId);
          clients.set(clientId, ws);
          tempId = clientId;
          ws.send(JSON.stringify({ type: 'system', message: 'ID registered successfully', clientId }));
        } else {
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid or duplicate ID' }));
        }
      } else if (parsedMessage.type === 'message') {
        // Route the message to the intended recipient
        const recipientWs = clients.get(parsedMessage.to);
        if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
          recipientWs.send(JSON.stringify({
            type: 'message',
            from: tempId,
            content: parsedMessage.content
          }));
        } else {
          ws.send(JSON.stringify({ type: 'error', message: 'Recipient not found' }));
        }
      }
    } catch (error) {
      console.error('Invalid JSON:', message);
    }
  });

  ws.on('close', function close() {
    console.log('Client disconnected');
    clients.delete(tempId);
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
