const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

let messages = [];

io.on('connection', (socket) => {
  console.log('🔌 New user connected:', socket.id);

  socket.emit('chat history', messages);

  socket.on('chat message', (data) => {
    messages.push(data);
    io.emit('chat message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve Vite build (optional for prod)
app.use(express.static(path.join(__dirname,"")));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
