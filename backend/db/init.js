const { getDB } = require('./database');
const bcrypt = require('bcryptjs');

// Menus mapped to day offsets (index 0 = 7 days ago, index 6 = yesterday)
const DAILY_MENUS = [
  'ข้าวผัดกะเพราไก่ไข่ดาว',
  'ข้าวมันไก่',
  'ก๋วยเตี๋ยวน้ำตุ๋น',
  'ข้าวหน้าเป็ดย่าง',
  'แกงเขียวหวานไก่ราดข้าว',
  'ผัดซีอิ๊วหมูไข่',
  'ข้าวหมูแดงราดข้าว',
];

// pattern[i]: true=finished, false=not_finished, index 0 = 7 days ago
const STUDENT_SEEDS = [
  {
    username: '31001', password: 'pass31001', name: 'มานี มีสุข', nickname: 'มานี', classroom: '3/1', grade: '3',
    pattern: [true, true, false, true, true, true, true],
    game: { total_points_earned: 60, current_points_balance: 25, monsters_killed_count: 2, current_stage: 3, current_monster_max_hp: 7000, current_monster_hp: 3800 },
    feedbacks: [
      { daysAgo: 3, s1: 'อยากกินราเมนไข่ออนเซนบ้างค่ะ', s2: 'อยากได้ผลไม้ทุกมื้อเลยค่ะ' },
      { daysAgo: 1, s1: 'อยากกินข้าวผัดปูซอสพริก', s2: 'ขอให้มีเมนูผักสดมากขึ้นหน่อยนะคะ' },
    ],
  },
  {
    username: '31002', password: 'pass31002', name: 'วิชัย เก่งมาก', nickname: 'วิ', classroom: '3/1', grade: '3',
    pattern: [true, true, true, false, true, false, true],
    game: { total_points_earned: 50, current_points_balance: 20, monsters_killed_count: 1, current_stage: 2, current_monster_max_hp: 4000, current_monster_hp: 2800 },
    feedbacks: [
      { daysAgo: 4, s1: 'อยากกินไก่ทอดกรอบบ้างครับ', s2: 'อาหารหวานเกินไปนิดนึงครับ' },
      { daysAgo: 1, s1: 'อยากกินราเมนญี่ปุ่น', s2: 'อยากได้น้ำผลไม้แทนน้ำเปล่าครับ' },
    ],
  },
  {
    username: '31003', password: 'pass31003', name: 'นารี น่ารัก', nickname: 'นารี', classroom: '3/1', grade: '3',
    pattern: [false, true, true, true, false, true, true],
    game: { total_points_earned: 50, current_points_balance: 25, monsters_killed_count: 2, current_stage: 3, current_monster_max_hp: 6000, current_monster_hp: 4200 },
    feedbacks: [
      { daysAgo: 2, s1: 'อยากกินยำวุ้นเส้นทะเลค่ะ', s2: 'ช่วยปรุงรสให้น้อยลงหน่อยได้ไหมคะ' },
    ],
  },
  {
    username: '31004', password: 'pass31004', name: 'สมศักดิ์ ดีงาม', nickname: 'ศักดิ์', classroom: '3/1', grade: '3',
    pattern: [true, false, false, true, true, true, false],
    game: { total_points_earned: 40, current_points_balance: 15, monsters_killed_count: 1, current_stage: 2, current_monster_max_hp: 3500, current_monster_hp: 2200 },
    feedbacks: [
      { daysAgo: 5, s1: 'อยากกินข้าวมันไก่อบซอสพิเศษครับ', s2: 'ข้าวหน้าเป็ดวันอังคารค่อนข้างเค็มมากครับ' },
    ],
  },
  {
    username: '31005', password: 'pass31005', name: 'อรอุมา สวยงาม', nickname: 'อุ้ม', classroom: '3/1', grade: '3',
    pattern: [false, true, false, true, true, false, true],
    game: { total_points_earned: 40, current_points_balance: 30, monsters_killed_count: 0, current_stage: 1, current_monster_max_hp: 2000, current_monster_hp: 2000 },
    feedbacks: [],
  },
  {
    username: '32001', password: 'pass32001', name: 'พิชิต โชคดี', nickname: 'พิช', classroom: '3/2', grade: '3',
    pattern: [true, true, true, true, false, true, true],
    game: { total_points_earned: 60, current_points_balance: 15, monsters_killed_count: 2, current_stage: 3, current_monster_max_hp: 5000, current_monster_hp: 3800 },
    feedbacks: [
      { daysAgo: 3, s1: 'อยากกินสุกี้น้ำแดงครับ', s2: 'ของหวานน้อยเกินไปครับ' },
    ],
  },
  {
    username: '32002', password: 'pass32002', name: 'สุนิสา แก้วใส', nickname: 'นิสา', classroom: '3/2', grade: '3',
    pattern: [true, true, true, true, true, true, true], // Perfect 7/7!
    game: { total_points_earned: 70, current_points_balance: 10, monsters_killed_count: 5, current_stage: 6, current_monster_max_hp: 14000, current_monster_hp: 7500 },
    feedbacks: [
      { daysAgo: 3, s1: 'อยากกินสุกี้ฮายชิค่ะ', s2: 'อยากให้มีผักเพิ่มในทุกเมนูเลยค่ะ' },
      { daysAgo: 1, s1: 'อยากกินพิซซ่าหน้าชีสค่ะ', s2: 'อาหารอร่อยมากค่ะ ขอบคุณแม่ครัวด้วยนะคะ 💚' },
    ],
  },
  {
    username: '32003', password: 'pass32003', name: 'กิตติ ศรีสวัสดิ์', nickname: 'กิต', classroom: '3/2', grade: '3',
    pattern: [false, false, true, true, true, false, true],
    game: { total_points_earned: 40, current_points_balance: 15, monsters_killed_count: 1, current_stage: 2, current_monster_max_hp: 4000, current_monster_hp: 3500 },
    feedbacks: [
      { daysAgo: 2, s1: 'อยากกินข้าวกะเพราหมูกรอบครับ', s2: 'ส่วนใหญ่อร่อยดีครับ' },
    ],
  },
  {
    username: '32004', password: 'pass32004', name: 'ลัดดา มณีวงศ์', nickname: 'ลัด', classroom: '3/2', grade: '3',
    pattern: [true, true, false, true, false, true, true],
    game: { total_points_earned: 50, current_points_balance: 20, monsters_killed_count: 2, current_stage: 3, current_monster_max_hp: 6000, current_monster_hp: 4500 },
    feedbacks: [
      { daysAgo: 1, s1: 'อยากกินโจ๊กหมูบ้างค่ะ', s2: 'อยากให้มีนมโรงเรียนให้ดื่มด้วยนะคะ' },
    ],
  },
  {
    username: '32005', password: 'pass32005', name: 'ณัฐวุฒิ พรหมดี', nickname: 'ณัฐ', classroom: '3/2', grade: '3',
    pattern: [true, false, true, true, true, true, true],
    game: { total_points_earned: 60, current_points_balance: 25, monsters_killed_count: 3, current_stage: 4, current_monster_max_hp: 8000, current_monster_hp: 5500 },
    feedbacks: [
      { daysAgo: 2, s1: 'อยากกินบิ๊กแมคครับ 555', s2: 'มีผักน้อยไปครับ อยากได้ผักเพิ่มมากๆ ครับ' },
    ],
  },
];

function daysAgoStr(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function initDatabase() {
  const db = getDB();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('student', 'teacher')),
      name TEXT NOT NULL,
      nickname TEXT,
      classroom TEXT,
      grade TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS meal_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      menu_name TEXT NOT NULL,
      is_finished INTEGER NOT NULL DEFAULT 0,
      points_changed INTEGER NOT NULL DEFAULT 0,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS game_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER UNIQUE NOT NULL,
      current_stage INTEGER NOT NULL DEFAULT 1,
      total_points_earned INTEGER NOT NULL DEFAULT 0,
      current_points_balance INTEGER NOT NULL DEFAULT 0,
      monsters_killed_count INTEGER NOT NULL DEFAULT 0,
      current_monster_hp INTEGER NOT NULL DEFAULT 2000,
      current_monster_max_hp INTEGER NOT NULL DEFAULT 2000,
      play_unlocked_today INTEGER NOT NULL DEFAULT 0,
      last_unlock_date TEXT,
      last_played_date TEXT,
      FOREIGN KEY (student_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      suggestion1 TEXT,
      suggestion2 TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_meal_student_date ON meal_records(student_id, date);
    CREATE INDEX IF NOT EXISTS idx_feedback_student_date ON feedback(student_id, date);
  `);

  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count === 0) {
    seedData(db);
  }

  console.log('✅ Database initialized');
}

function seedData(db) {
  const salt = bcrypt.genSaltSync(10);

  const insertUser = db.prepare(
    'INSERT INTO users (username, password, role, name, nickname, classroom, grade) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const insertMeal = db.prepare(
    'INSERT INTO meal_records (student_id, date, menu_name, is_finished, points_changed) VALUES (?, ?, ?, ?, ?)'
  );
  const insertProgress = db.prepare(
    `INSERT INTO game_progress
      (student_id, current_stage, total_points_earned, current_points_balance, monsters_killed_count,
       current_monster_hp, current_monster_max_hp, last_played_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const insertFeedback = db.prepare(
    'INSERT INTO feedback (student_id, date, suggestion1, suggestion2) VALUES (?, ?, ?, ?)'
  );

  db.transaction(() => {
    // Teachers
    insertUser.run('teacher01', bcrypt.hashSync('password123', salt), 'teacher', 'สมหญิง ใจดี', 'ครูหญิง', '3/1', '3');
    insertUser.run('teacher02', bcrypt.hashSync('password123', salt), 'teacher', 'สมชาย มีสุข', 'ครูชาย', '3/2', '3');

    // Students + meal history + game progress + feedback
    for (const s of STUDENT_SEEDS) {
      const result = insertUser.run(
        s.username, bcrypt.hashSync(s.password, salt), 'student',
        s.name, s.nickname, s.classroom, s.grade
      );
      const studentId = result.lastInsertRowid;

      // 7 days of meal history
      for (let i = 0; i < 7; i++) {
        const finished = s.pattern[i];
        const dayOffset = 7 - i; // index 0 = 7 days ago, index 6 = 1 day ago
        const dateStr = daysAgoStr(dayOffset);
        const pts = finished ? 10 : -5;
        insertMeal.run(studentId, dateStr, DAILY_MENUS[i], finished ? 1 : 0, pts);
      }

      // Game progress
      insertProgress.run(
        studentId,
        s.game.current_stage,
        s.game.total_points_earned,
        s.game.current_points_balance,
        s.game.monsters_killed_count,
        s.game.current_monster_hp,
        s.game.current_monster_max_hp,
        daysAgoStr(1), // last_played = yesterday
      );

      // Feedback entries
      for (const fb of s.feedbacks) {
        insertFeedback.run(studentId, daysAgoStr(fb.daysAgo), fb.s1 || null, fb.s2 || null);
      }
    }
  })();

  console.log('✅ Seed data created');
  console.log('  Teachers: teacher01/password123, teacher02/password123');
  console.log('  Students: 31001/pass31001 … 32005/pass32005');
}

function resetAndSeed(db) {
  db.exec(`
    DELETE FROM feedback;
    DELETE FROM game_progress;
    DELETE FROM meal_records;
    DELETE FROM users;
  `);
  console.log('🗑️  All data cleared');
  seedData(db);
}

module.exports = { initDatabase, resetAndSeed };

if (require.main === module) {
  const reset = process.argv.includes('--reset');
  initDatabase();
  if (reset) {
    console.log('🔄 Resetting data...');
    resetAndSeed(getDB());
  }
  process.exit(0);
}
