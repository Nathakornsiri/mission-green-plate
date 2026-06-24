require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { initDatabase } = require('./db/init');
const authRoutes = require('./routes/auth');
const mealsRoutes = require('./routes/meals');
const studentsRoutes = require('./routes/students');
const teachersRoutes = require('./routes/teachers');
const gameRoutes = require('./routes/game');
const feedbackRoutes = require('./routes/feedback');
const demoRoutes = require('./routes/demo');

const app = express();
const PORT = process.env.PORT || 5000;
const IS_PROD = process.env.NODE_ENV === 'production';

initDatabase();

// CORS: allow dev proxy + explicit production origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: IS_PROD ? allowedOrigins : true,
  credentials: true,
}));
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/meal-records', mealsRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/demo', demoRoutes); // always mounted — demo panel is part of the product

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    demo_mode: process.env.DEMO_MODE === 'true',
  });
});

// In production, serve the Vite build from frontend/dist
if (IS_PROD) {
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🌱 Mission Green Plate ${IS_PROD ? '[PRODUCTION]' : '[DEV]'} on http://localhost:${PORT}`);
  if (!IS_PROD) console.log('   Demo IoT Panel: /api/demo/students');
});
