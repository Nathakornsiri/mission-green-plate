const express = require('express');
const { getDB } = require('../db/database');
const { authMiddleware, teacherOnly, studentOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, studentOnly, (req, res) => {
  const { suggestion1, suggestion2 } = req.body;
  const db = getDB();
  const today = new Date().toISOString().split('T')[0];

  const existing = db.prepare(
    'SELECT id FROM feedback WHERE student_id = ? AND date = ?'
  ).get(req.user.id, today);

  if (existing) {
    db.prepare(
      'UPDATE feedback SET suggestion1 = ?, suggestion2 = ?, timestamp = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(suggestion1 || null, suggestion2 || null, existing.id);
    return res.json({ success: true, updated: true });
  }

  db.prepare(
    'INSERT INTO feedback (student_id, date, suggestion1, suggestion2) VALUES (?, ?, ?, ?)'
  ).run(req.user.id, today, suggestion1 || null, suggestion2 || null);

  res.json({ success: true, created: true });
});

router.get('/my', authMiddleware, studentOnly, (req, res) => {
  const db = getDB();
  const records = db.prepare(
    'SELECT * FROM feedback WHERE student_id = ? ORDER BY date DESC LIMIT 30'
  ).all(req.user.id);
  res.json(records);
});

router.get('/student/:id', authMiddleware, teacherOnly, (req, res) => {
  const db = getDB();
  const records = db.prepare(`
    SELECT f.*, u.name as student_name, u.classroom
    FROM feedback f JOIN users u ON f.student_id = u.id
    WHERE f.student_id = ? ORDER BY f.date DESC LIMIT 30
  `).all(parseInt(req.params.id));
  res.json(records);
});

router.get('/classroom', authMiddleware, teacherOnly, (req, res) => {
  const db = getDB();
  const teacher = db.prepare('SELECT classroom FROM users WHERE id = ?').get(req.user.id);
  const records = db.prepare(`
    SELECT f.*, u.name as student_name, u.nickname, u.classroom
    FROM feedback f JOIN users u ON f.student_id = u.id
    WHERE u.classroom = ?
    ORDER BY f.date DESC, f.timestamp DESC LIMIT 100
  `).all(teacher.classroom);
  res.json(records);
});

module.exports = router;
