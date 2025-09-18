const express = require('express');
const dotenv = require('dotenv');
const cors =require('cors');
const path = require('path');
const http = require('http'); // Import http
const { Server } = require("socket.io"); // Import Server from socket.io

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const helpRequestRoutes = require('./routes/helpRequestRoutes');
const userRoutes = require('./routes/userRoutes');
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // Create an HTTP server from the Express app
const io = new Server(server, { // Initialize socket.io with the server
  cors: {
    origin: "http://localhost:5173", // Allow requests from your frontend
    methods: ["GET", "POST"]
  }
});

// Middleware to make 'io' accessible in routes
app.set('socketio', io); 

app.use(cors());
app.use(express.json());

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', helpRequestRoutes);
app.use('/api/users', userRoutes);

// const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server with real-time support running on port ${PORT}`));
