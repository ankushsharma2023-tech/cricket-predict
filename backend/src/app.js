// Require necessary dependencies
const express = require('express');
const mysql = require('mysql2/promise');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Enable CORS
app.use(cors());

// Middleware to parse request body
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true // Needed for Railway SSL
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

// Users leaderboard endpoint
app.get('/api/leaderboard', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users ORDER BY score DESC LIMIT 10');
        res.json(rows);
    } catch (error) {
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
