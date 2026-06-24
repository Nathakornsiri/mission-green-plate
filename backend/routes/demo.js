const express = require('express');
const { getDB } = require('../db/database');
const { resetAndSeed } = require('../db/init');

const router = express.Router();

// Public endpoint — lists all students for the IoT Simulator Panel
router.get('/students', (_req, res) => {
  const db = getDB();
  const today = new Date().toISOString().split('T')[0];

  const students = db.prepare(`
    SELECT u.id, u.username, u.name, u.nickname, u.classroom, u.grade,
           gp.current_points_balance,
           gp.play_unlocked_today,
           gp.last_unlock_date,
           gp.monsters_killed_count,
           gp.current_stage
    FROM users u
    LEFT JOIN game_progress gp ON u.id = gp.student_id
    WHERE u.role = 'student'
    ORDER BY u.classroom, u.name
  `).all();

  // Check if today's meal record already exists for each student
  const todayRecords = db.prepare(`
    SELECT student_id, menu_name, is_finished
    FROM meal_records WHERE date = ?
  `).all(today);
  const todayMap = Object.fromEntries(todayRecords.map(r => [r.student_id, r]));

  res.json(students.map((s) => ({
    ...s,
    play_unlocked_today: s.last_unlock_date === today ? s.play_unlocked_today : 0,
    today_record: todayMap[s.id] || null,
  })));
});

// POST /api/demo/reset — re-seeds all mock data (demo only, protected by secret)
router.post('/reset', (req, res) => {
  const { secret } = req.body;
  if (secret !== (process.env.DEMO_RESET_SECRET || 'reset_greenplate_demo')) {
    return res.status(403).json({ error: 'Invalid secret' });
  }

  try {
    const db = getDB();
    resetAndSeed(db);
    res.json({ success: true, message: 'Demo data has been reset successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
