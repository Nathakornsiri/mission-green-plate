const express = require('express');
const { getDB } = require('../db/database');
const { authMiddleware, teacherOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/me', authMiddleware, teacherOnly, (req, res) => {
  const db = getDB();
  const teacher = db.prepare(
    'SELECT id, username, name, nickname, classroom, grade FROM users WHERE id = ?'
  ).get(req.user.id);
  res.json(teacher);
});

router.get('/classroom-summary', authMiddleware, teacherOnly, (req, res) => {
  const db = getDB();
  const today = new Date().toISOString().split('T')[0];
  const teacher = db.prepare('SELECT classroom FROM users WHERE id = ?').get(req.user.id);

  const summary = db.prepare(`
    SELECT
      COUNT(*) as total_students,
      SUM(CASE WHEN mr.is_finished = 1 THEN 1 ELSE 0 END) as finished_count,
      SUM(CASE WHEN mr.is_finished = 0 AND mr.id IS NOT NULL THEN 1 ELSE 0 END) as not_finished_count,
      SUM(CASE WHEN mr.id IS NULL THEN 1 ELSE 0 END) as not_scanned_count
    FROM users u
    LEFT JOIN meal_records mr ON u.id = mr.student_id AND mr.date = ?
    WHERE u.role = 'student' AND u.classroom = ?
  `).get(today, teacher.classroom);

  res.json({ ...summary, classroom: teacher.classroom, date: today });
});

module.exports = router;
