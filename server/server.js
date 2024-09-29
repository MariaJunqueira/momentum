const WebSocket = require('ws');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const secretKey = 'your-secret-key'; // TODO: to add secret as env variable
const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: 'http://localhost:4200', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));

app.get('/test-db-connection', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ success: true, message: `Database connected. User count: ${userCount}` });
  } catch (err) {
    console.error('Error checking database connection:', err);
    res.status(500).json({ success: false, message: 'Failed to connect to database' });
  }
});

mongoose.connect('mongodb://mongodb:27017/websocketApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String, // TODO: Transform passwords in hash
});
const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  console.log(req)
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.json({ message: 'User registered' });
});

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Map(); 

wss.on('connection', function connection(ws, req) {
  console.log('A new client connected');
    
  const token = req.url.split('token=')[1];
  
  if (!token) {
    ws.close(1008, 'Authentication token required');
    return;
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    console.log(token)
    if (err) {
      ws.close(1008, 'Invalid or expired token');
      return;
    }

    const username = decoded.username;
    clients.set(username, ws);

    ws.send(JSON.stringify({ type: 'system', message: 'Welcome to the WebSocket server!', username }));

    ws.on('message', function incoming(message) {
      try {
        const parsedMessage = JSON.parse(message);
        console.log('Received message:', parsedMessage);

        if (parsedMessage.type === 'message') {
          const recipientWs = clients.get(parsedMessage.to);
          if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
            recipientWs.send(JSON.stringify({
              type: 'message',
              from: username,
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
      clients.delete(username);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
