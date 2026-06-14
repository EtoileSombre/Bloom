// server.js — point d entree de l application (MVC)
const express   = require('express');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectMongo } = require('./config/db');

// Routes
const goalsRouter  = require('./routes/goals');
const checksRouter = require('./routes/checks');
const logsRouter   = require('./routes/logs');

const app = express();

// ── Securite ──────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requetes, veuillez reessayer plus tard.' },
}));
app.use(express.json({ limit: '10kb' }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/goals',  goalsRouter);
app.use('/api/checks', checksRouter);
app.use('/api/logs',   logsRouter);

// ── Demarrage ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

connectMongo()
  .then(() => {
    app.listen(PORT, () => console.log(`Bloom API demarree sur le port ${PORT}`));
  })
  .catch(err => {
    console.error('Echec connexion MongoDB :', err.message);
    process.exit(1);
  });
