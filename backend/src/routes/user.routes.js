const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const db = require('../models/db');

router.get('/profile', auth, async (req, res) => {
  const [rows] = await db.query(
    'SELECT id, username, email, total_points, current_streak, longest_streak, created_at FROM users WHERE id = ?',
    [req.user.id]
  );
  res.json(rows[0]);
});

module.exports = router;