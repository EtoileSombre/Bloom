const express   = require('express');
const mysql     = require('mysql2/promise');
const mongoose  = require('mongoose');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// ============================================================
// SECURITE — Headers HTTP (OWASP)
// ============================================================
// helmet() active : X-Content-Type-Options, X-Frame-Options,
// Strict-Transport-Security, Content-Security-Policy, etc.
app.use(helmet());

// Limite le nombre de requetes par IP (anti brute-force / DoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // fenetre de 15 minutes
  max: 200,                  // max 200 requetes par IP par fenetre
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requetes, veuillez reessayer plus tard.' },
});
app.use('/api/', limiter);

// Limite la taille des corps JSON (anti DoS)
app.use(express.json({ limit: '10kb' }));

// ============================================================
// CONNEXION MySQL
// ============================================================
const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  user:               process.env.DB_USER     || 'bloom',
  password:           process.env.DB_PASSWORD || 'bloompassword',
  database:           process.env.DB_NAME     || 'bloom',
  charset:            'utf8mb4',
  waitForConnections: true,
  connectionLimit:    10,
});

// ============================================================
// CONNEXION MongoDB (logs d activite — NoSQL)
// ============================================================
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bloom_logs';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connecte'))
  .catch(err => console.error('Erreur MongoDB :', err.message));

// Schema NoSQL — journal d activite (append-only)
const logSchema = new mongoose.Schema({
  action:    { type: String, required: true },
  goalId:    Number,
  goalTitle: String,
  details:   mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
});
const Log = mongoose.model('Log', logSchema);

// Helper : enregistre une action dans MongoDB
async function logAction(action, goalId, goalTitle, details = {}) {
  try {
    await Log.create({ action, goalId, goalTitle, details });
  } catch (err) {
    console.error('Erreur log MongoDB :', err.message);
  }
}

// ============================================================
// VALIDATION des entrees
// ============================================================
// Sanitise une chaine : supprime les caracteres de controle
function sanitizeString(str, maxLen = 255) {
  return String(str).replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, maxLen);
}

function isValidId(id) {
  return Number.isInteger(id) && id > 0;
}

// ============================================================
// ROUTES — Objectifs (MySQL)
// ============================================================

// GET /api/goals/with-streaks — liste + streak + etat du jour
app.get('/api/goals/with-streaks', async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const [goals]       = await pool.query('SELECT * FROM goals ORDER BY created_at ASC');
    const [todayChecks] = await pool.query(
      'SELECT goal_id FROM daily_checks WHERE checked_on = ?', [today]
    );
    const [allChecks]   = await pool.query(
      'SELECT goal_id, checked_on FROM daily_checks ORDER BY checked_on DESC'
    );

    const checkedToday = new Set(todayChecks.map(r => r.goal_id));

    const checksByGoal = {};
    for (const row of allChecks) {
      const gid = row.goal_id;
      const iso = row.checked_on instanceof Date
        ? row.checked_on.toISOString().slice(0, 10)
        : String(row.checked_on);
      if (!checksByGoal[gid]) checksByGoal[gid] = new Set();
      checksByGoal[gid].add(iso);
    }

    const result = goals.map(g => {
      const dates = checksByGoal[g.id] || new Set();
      let streak = 0;
      const d = new Date();
      while (true) {
        const iso = d.toISOString().slice(0, 10);
        if (dates.has(iso)) { streak++; d.setDate(d.getDate() - 1); }
        else break;
      }
      return { ...g, streak, checkedToday: checkedToday.has(g.id) };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// POST /api/goals — creer un objectif
app.post('/api/goals', async (req, res) => {
  const rawTitle = req.body?.title;
  const rawIcon  = req.body?.icon ?? '🌱';

  if (!rawTitle) return res.status(400).json({ error: 'Le champ title est requis.' });

  const title = sanitizeString(rawTitle, 255);
  const icon  = sanitizeString(rawIcon, 10);

  if (!title) return res.status(400).json({ error: 'Titre invalide.' });

  try {
    const [result] = await pool.query(
      'INSERT INTO goals (title, icon) VALUES (?, ?)', [title, icon]
    );
    const [rows] = await pool.query('SELECT * FROM goals WHERE id = ?', [result.insertId]);
    const goal = rows[0];
    await logAction('add_goal', goal.id, goal.title);
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// DELETE /api/goals/:id — supprimer un objectif
app.delete('/api/goals/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!isValidId(id)) return res.status(400).json({ error: 'ID invalide.' });

  try {
    const [rows] = await pool.query('SELECT title FROM goals WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Objectif introuvable.' });

    const title = rows[0].title;
    await pool.query('DELETE FROM goals WHERE id = ?', [id]);
    await logAction('delete_goal', id, title);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ============================================================
// ROUTES — Coches journalieres (MySQL)
// ============================================================

// POST /api/checks — cocher ou decocher pour aujourd hui
app.post('/api/checks', async (req, res) => {
  const rawId   = req.body?.goalId;
  const checked = req.body?.checked;

  const id = parseInt(rawId, 10);
  if (!isValidId(id))               return res.status(400).json({ error: 'goalId invalide.' });
  if (typeof checked !== 'boolean') return res.status(400).json({ error: 'checked doit etre un booleen.' });

  const today = new Date().toISOString().slice(0, 10);
  try {
    const [rows] = await pool.query('SELECT title FROM goals WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Objectif introuvable.' });

    const title = rows[0].title;
    if (checked) {
      await pool.query(
        'INSERT IGNORE INTO daily_checks (goal_id, checked_on) VALUES (?, ?)', [id, today]
      );
      await logAction('check', id, title, { date: today });
    } else {
      await pool.query(
        'DELETE FROM daily_checks WHERE goal_id = ? AND checked_on = ?', [id, today]
      );
      await logAction('uncheck', id, title, { date: today });
    }
    res.status(200).end();
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ============================================================
// ROUTES — Logs d activite (MongoDB — NoSQL)
// ============================================================

// GET /api/logs — 50 dernieres actions
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 }).limit(50).lean();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// GET /api/logs/:goalId — logs d un objectif
app.get('/api/logs/:goalId', async (req, res) => {
  const id = parseInt(req.params.goalId, 10);
  if (!isValidId(id)) return res.status(400).json({ error: 'ID invalide.' });
  try {
    const logs = await Log.find({ goalId: id }).sort({ createdAt: -1 }).lean();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ============================================================
// Demarrage
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bloom API demarree sur le port ${PORT}`));
