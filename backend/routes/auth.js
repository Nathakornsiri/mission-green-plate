const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'greenplate_mission_secret_2024_change_in_production';

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
  }

  const db = getDB();
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username.trim());

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, name: user.name, classroom: user.classroom, grade: user.grade },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      nickname: user.nickname,
      classroom: user.classroom,
      grade: user.grade,
    },
  });
});

router.get('/me', authMiddleware, (req, res) => {
  const db = getDB();
  const user = db.prepare(
    'SELECT id, username, role, name, nickname, classroom, grade FROM users WHERE id = ?'
  ).get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

module.exports = router;
