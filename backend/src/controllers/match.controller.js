const db = require('../models/db');

exports.getMatches = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM matches ORDER BY match_time ASC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMatchQuestions = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM questions WHERE match_id = ?',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};