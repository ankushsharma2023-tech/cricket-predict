// Require necessary dependencies
const express = require('express');
const mysql = require('mysql2/promise');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Middleware to parse request body
app.use(express.json());

// MySQL connection pool - optimized for Railway
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelayMs: 0,
    connectionTimeout: 5000,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

let dbConnected = false;

// Test connection (don't block startup)
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL Database Connected!');
    dbConnected = true;
    connection.release();
  })
  .catch(err => {
    console.warn('⚠️  Database will retry on first request:', err.message);
  });

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'Backend is running ✅',
        time: new Date(),
        database: dbConnected ? 'Connected' : 'Connecting...'
    });
});

// ==================== AUTH ROUTES ====================
app.use('/api/auth', authRoutes);

// Users leaderboard endpoint
app.get('/api/leaderboard', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT username, score FROM users ORDER BY score DESC LIMIT 10');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Predictions endpoint
app.post('/api/predictions', async (req, res) => {
    const { userId, prediction } = req.body;
    try {
        await pool.query('INSERT INTO predictions (user_id, prediction) VALUES (?, ?)', [userId, prediction]);
        res.status(201).json({ message: 'Prediction created' });
        io.emit('new_prediction', { userId, prediction }); // Real-time update
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server - bind to 0.0.0.0
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});