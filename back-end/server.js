const WebSocket = require('ws');
const express = require('express');
const cors = require('cors')

const app = express();
const port = 8080; // Replace this with your desired port


// Middleware to parse JSON body for POST requests
app.use(express.json());
app.use(cors())
// Rest Full APIs

// GET all items
app.get('/api/inputs', (req, res) => {
  res.send('test');
});

// POST new item
app.post('/api/data', (req, res) => {
  const newItem = req.body;
  newItem.id = inputArray.length + 1;
  inputArray.push(newItem);

  // Broadcast the new item to all connected WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'history_of_inputs', data: newItem }));
    }
  });
  

  res.status(201).json(newItem);

  // error handling
  if(res.error) {
    next(new Error('Error Occuried'));
}
});

// DELETE item by ID
app.delete('/api/items/:id', (req, res) => {
  const idToDelete = parseInt(req.params.id);
  inputArray.delete(idToDelete);

  // Broadcast the deleted item ID to all connected WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'deleted_item', data: idToDelete }));
    }
  });

  res.sendStatus(204);
});

// app.disable('etag');


let inputArray=[];
// Create a WebSocket server alongside the Express server
const wss = new WebSocket.Server({noServer:true});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('WebSocket connected');

  // Handle incoming messages from the client
  ws.on('message', (data) => {
    inputArray.push(data);
    console.log('Received from client:', data);

    // Echo the message back to the client
    ws.send(`Server echoing back: ${data}`);
  });

  // Handle WebSocket disconnection
  // ws.on('close', () => {
  //   console.log('WebSocket disconnected');
  // });
});

// Set up the Express server to handle the WebSocket upgrade request
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Upgrade HTTP requests to WebSocket
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

