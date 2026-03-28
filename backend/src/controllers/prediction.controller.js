const db = require('../models/db');

exports.submitPrediction = async (req, res) => {
  const { question_id, selected_answer } = req.body;
  const user_id = req.user.id;
  try {
    const [questions] = await db.query(
      `SELECT q.*, m.match_time, m.status FROM questions q
       JOIN matches m ON q.match_id = m.id WHERE q.id = ?`,
      [question_id]
    );
    const question = questions[0];
    if (!question) return res.status(404).json({ error: 'Question not found' });
    if (question.status !== 'upcoming') return res.status(400).json({ error: 'Predictions are closed' });
    if (new Date(question.match_time) < new Date()) return res.status(400).json({ error: 'Match has started' });

    await db.query(
      'INSERT INTO predictions (user_id, question_id, selected_answer) VALUES (?, ?, ?)',
      [user_id, question_id, selected_answer]
    );
    res.json({ message: 'Prediction submitted!' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Already predicted for this question' });
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserPredictions = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, q.question_text, q.correct_answer, q.points_reward
       FROM predictions p JOIN questions q ON p.question_id = q.id
       WHERE p.user_id = ? ORDER BY p.submitted_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};