const express = require('express');
const { getDB } = require('../db/database');
const { authMiddleware, teacherOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, teacherOnly, (req, res) => {
  const db = getDB();
  const { classroom, search } = req.query;

  let query = `
    SELECT u.id, u.username, u.name, u.nickname, u.classroom, u.grade,
           gp.current_stage, gp.total_points_earned, gp.current_points_balance,
           gp.monsters_killed_count
    FROM users u
    LEFT JOIN game_progress gp ON u.id = gp.student_id
    WHERE u.role = 'student'
  `;
  const params = [];

  if (classroom) { query += ' AND u.classroom = ?'; params.push(classroom); }
  if (search) {
    query += ' AND (u.name LIKE ? OR u.username LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY u.classroom, u.name';
  res.json(db.prepare(query).all(...params));
});

router.get('/:id', authMiddleware, (req, res) => {
  const db = getDB();
  const studentId = parseInt(req.params.id);

  if (req.user.role === 'student' && req.user.id !== studentId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const student = db.prepare(`
    SELECT u.id, u.username, u.name, u.nickname, u.classroom, u.grade,
           gp.current_stage, gp.total_points_earned, gp.current_points_balance,
           gp.monsters_killed_count, gp.current_monster_hp, gp.current_monster_max_hp,
           gp.play_unlocked_today, gp.last_unlock_date, gp.last_played_date,
           t.name as teacher_name
    FROM users u
    LEFT JOIN game_progress gp ON u.id = gp.student_id
    LEFT JOIN users t ON t.role = 'teacher' AND t.classroom = u.classroom
    WHERE u.id = ? AND u.role = 'student'
  `).get(studentId);

  if (!student) return res.status(404).json({ error: 'Student not found' });

  const today = new Date().toISOString().split('T')[0];
  student.play_unlocked_today = student.last_unlock_date === today ? student.play_unlocked_today : 0;

  res.json(student);
});

router.get('/:id/timeline', authMiddleware, (req, res) => {
  const db = getDB();
  const studentId = parseInt(req.params.id);

  if (req.user.role === 'student' && req.user.id !== studentId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const records = db.prepare(`
    SELECT mr.id, mr.date, mr.menu_name, mr.is_finished, mr.points_changed, mr.timestamp,
           u.name as student_name, u.classroom
    FROM meal_records mr
    JOIN users u ON mr.student_id = u.id
    WHERE mr.student_id = ?
    ORDER BY mr.date DESC, mr.timestamp DESC
    LIMIT 90
  `).all(studentId);

  res.json(records);
});

module.exports = router;
