const db = require('../models/db');

exports.getLeaderboard = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, username, total_points, current_streak
       FROM users ORDER BY total_points DESC LIMIT 50`
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ Leaderboard Error:', err.message);
    console.error('Full Error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};