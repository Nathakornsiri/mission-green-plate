const express = require('express');
const { getDB } = require('../db/database');
const { authMiddleware, teacherOnly } = require('../middleware/auth');

const router = express.Router();

// IoT endpoint — no auth required (secured by internal network in production)
router.post('/', (req, res) => {
  const { student_uid, menu_name, is_finished } = req.body;

  if (!student_uid || !menu_name || is_finished === undefined) {
    return res.status(400).json({ error: 'Missing required fields: student_uid, menu_name, is_finished' });
  }

  const db = getDB();
  const today = new Date().toISOString().split('T')[0];

  const student = db.prepare("SELECT * FROM users WHERE username = ? AND role = 'student'").get(String(student_uid));
  if (!student) {
    return res.status(404).json({ error: `Student UID "${student_uid}" not found` });
  }

  const existing = db.prepare(
    'SELECT * FROM meal_records WHERE student_id = ? AND date = ?'
  ).get(student.id, today);

  if (existing) {
    return res.status(409).json({ error: 'Meal already recorded for today', record: existing });
  }

  const finished = Boolean(is_finished);
  const pointsChanged = finished ? 10 : -5;

  let progress = db.prepare('SELECT * FROM game_progress WHERE student_id = ?').get(student.id);
  if (!progress) {
    db.prepare(
      `INSERT INTO game_progress
        (student_id, current_stage, total_points_earned, current_points_balance, monsters_killed_count, current_monster_hp, current_monster_max_hp)
       VALUES (?, 1, 0, 0, 0, 2000, 2000)`
    ).run(student.id);
    progress = db.prepare('SELECT * FROM game_progress WHERE student_id = ?').get(student.id);
  }

  const newBalance = Math.max(0, progress.current_points_balance + pointsChanged);
  const newTotalEarned = progress.total_points_earned + (finished ? 10 : 0);

  db.transaction(() => {
    db.prepare(
      'INSERT INTO meal_records (student_id, date, menu_name, is_finished, points_changed) VALUES (?, ?, ?, ?, ?)'
    ).run(student.id, today, menu_name, finished ? 1 : 0, pointsChanged);

    db.prepare(`
      UPDATE game_progress
      SET current_points_balance = ?,
          total_points_earned = ?,
          play_unlocked_today = ?,
          last_unlock_date = CASE WHEN ? = 1 THEN ? ELSE last_unlock_date END
      WHERE student_id = ?
    `).run(newBalance, newTotalEarned, finished ? 1 : 0, finished ? 1 : 0, today, student.id);
  })();

  res.json({
    success: true,
    student: { id: student.id, name: student.name },
    meal: { menu_name, is_finished: finished, points_changed: pointsChanged },
    points: { new_balance: newBalance, total_earned: newTotalEarned },
    game_unlocked: finished,
  });
});

// Today's records for the teacher dashboard
router.get('/today', authMiddleware, teacherOnly, (req, res) => {
  const db = getDB();
  const today = new Date().toISOString().split('T')[0];
  const { classroom } = req.query;

  let query = `
    SELECT u.id, u.name, u.username, u.nickname, u.classroom,
           mr.menu_name, mr.is_finished, mr.points_changed, mr.timestamp
    FROM users u
    LEFT JOIN meal_records mr ON u.id = mr.student_id AND mr.date = ?
    WHERE u.role = 'student'
  `;
  const params = [today];

  if (classroom) {
    query += ' AND u.classroom = ?';
    params.push(classroom);
  }

  query += ' ORDER BY u.classroom, u.name';

  res.json(db.prepare(query).all(...params));
});

// Historical records for a specific student
router.get('/student/:id', authMiddleware, (req, res) => {
  const db = getDB();
  const studentId = parseInt(req.params.id);

  if (req.user.role === 'student' && req.user.id !== studentId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const records = db.prepare(`
    SELECT * FROM meal_records WHERE student_id = ?
    ORDER BY date DESC, timestamp DESC LIMIT 90
  `).all(studentId);

  res.json(records);
});

module.exports = router;
