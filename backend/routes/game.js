const express = require('express');
const { getDB } = require('../db/database');
const { authMiddleware, studentOnly } = require('../middleware/auth');

const router = express.Router();

const SKILLS = {
  1: { cost: 10, damage: 500, type: 'instant', name: 'โจมตีปกติ' },
  2: { cost: 20, damage: 1200, type: 'instant', name: 'โจมตีหนัก' },
  3: { cost: 40, damage: 2500, type: 'poison', name: 'พิษขยะ' },
};

const HP_INCREASES = [1000, 2000, 3000, 4000];

router.get('/progress', authMiddleware, studentOnly, (req, res) => {
  const db = getDB();
  const today = new Date().toISOString().split('T')[0];

  let progress = db.prepare('SELECT * FROM game_progress WHERE student_id = ?').get(req.user.id);
  if (!progress) {
    db.prepare(
      `INSERT INTO game_progress
        (student_id, current_stage, total_points_earned, current_points_balance, monsters_killed_count, current_monster_hp, current_monster_max_hp)
       VALUES (?, 1, 0, 0, 0, 2000, 2000)`
    ).run(req.user.id);
    progress = db.prepare('SELECT * FROM game_progress WHERE student_id = ?').get(req.user.id);
  }

  const playUnlocked = progress.last_unlock_date === today && progress.play_unlocked_today === 1;
  res.json({ ...progress, play_unlocked_today: playUnlocked ? 1 : 0 });
});

router.post('/attack', authMiddleware, studentOnly, (req, res) => {
  const { skill } = req.body;
  const db = getDB();
  const today = new Date().toISOString().split('T')[0];

  const progress = db.prepare('SELECT * FROM game_progress WHERE student_id = ?').get(req.user.id);
  if (!progress) return res.status(404).json({ error: 'Game progress not found' });

  const playUnlocked = progress.last_unlock_date === today && progress.play_unlocked_today === 1;
  if (!playUnlocked) {
    return res.status(403).json({ error: 'กินไม่หมด อดเล่นเกม', locked: true });
  }

  const skillData = SKILLS[Number(skill)];
  if (!skillData) return res.status(400).json({ error: 'Invalid skill (1, 2, or 3)' });

  if (progress.current_points_balance < skillData.cost) {
    return res.status(400).json({
      error: 'แต้มไม่พอ',
      required: skillData.cost,
      current: progress.current_points_balance,
    });
  }

  const newBalance = progress.current_points_balance - skillData.cost;
  let newMonsterHp = Math.max(0, progress.current_monster_hp - skillData.damage);
  let monsterKilled = false;
  let newStage = progress.current_stage;
  let newMonsterMaxHp = progress.current_monster_max_hp;
  let monstersKilled = progress.monsters_killed_count;

  if (newMonsterHp <= 0) {
    monsterKilled = true;
    monstersKilled++;
    newStage = (progress.current_stage % 10) + 1;
    const increase = HP_INCREASES[Math.floor(Math.random() * HP_INCREASES.length)];
    newMonsterMaxHp = progress.current_monster_max_hp + increase;
    newMonsterHp = newMonsterMaxHp;
  }

  db.prepare(`
    UPDATE game_progress
    SET current_points_balance = ?,
        current_stage = ?,
        current_monster_hp = ?,
        current_monster_max_hp = ?,
        monsters_killed_count = ?,
        last_played_date = ?
    WHERE student_id = ?
  `).run(newBalance, newStage, newMonsterHp, newMonsterMaxHp, monstersKilled, today, req.user.id);

  res.json({
    success: true,
    skill_used: Number(skill),
    skill_name: skillData.name,
    damage_dealt: skillData.damage,
    skill_type: skillData.type,
    monster_killed: monsterKilled,
    new_stage: newStage,
    monster_hp: { current: newMonsterHp, max: newMonsterMaxHp },
    points: { spent: skillData.cost, new_balance: newBalance },
    monsters_killed_count: monstersKilled,
  });
});

router.get('/leaderboard', authMiddleware, (req, res) => {
  const db = getDB();
  const { type = 'individual', classroom, grade } = req.query;

  if (type === 'individual') {
    let query = `
      SELECT u.id, u.name, u.nickname, u.classroom, u.grade,
             gp.total_points_earned, gp.monsters_killed_count, gp.current_points_balance,
             gp.current_stage
      FROM users u
      JOIN game_progress gp ON u.id = gp.student_id
      WHERE u.role = 'student'
    `;
    const params = [];
    if (classroom) { query += ' AND u.classroom = ?'; params.push(classroom); }
    if (grade) { query += ' AND u.grade = ?'; params.push(grade); }
    query += ' ORDER BY gp.total_points_earned DESC LIMIT 50';
    return res.json(db.prepare(query).all(...params));
  }

  if (type === 'classroom') {
    return res.json(db.prepare(`
      SELECT u.classroom, u.grade,
             SUM(gp.total_points_earned) as total_points,
             SUM(gp.monsters_killed_count) as total_monsters,
             COUNT(*) as student_count
      FROM users u JOIN game_progress gp ON u.id = gp.student_id
      WHERE u.role = 'student'
      GROUP BY u.classroom, u.grade
      ORDER BY total_points DESC
    `).all());
  }

  if (type === 'grade') {
    return res.json(db.prepare(`
      SELECT u.grade,
             SUM(gp.total_points_earned) as total_points,
             SUM(gp.monsters_killed_count) as total_monsters,
             COUNT(*) as student_count
      FROM users u JOIN game_progress gp ON u.id = gp.student_id
      WHERE u.role = 'student'
      GROUP BY u.grade
      ORDER BY total_points DESC
    `).all());
  }

  res.status(400).json({ error: 'Invalid type. Use individual, classroom, or grade' });
});

module.exports = router;
