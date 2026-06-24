const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'greenplate_mission_secret_2024_change_in_production';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function teacherOnly(req, res, next) {
  if (req.user?.role !== 'teacher') {
    return res.status(403).json({ error: 'Teacher access required' });
  }
  next();
}

function studentOnly(req, res, next) {
  if (req.user?.role !== 'student') {
    return res.status(403).json({ error: 'Student access required' });
  }
  next();
}

module.exports = { authMiddleware, teacherOnly, studentOnly };
