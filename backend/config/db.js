// config/db.js — connexions MySQL et MongoDB
const mysql    = require('mysql2/promise');
const mongoose = require('mongoose');

// ── MySQL ─────────────────────────────────────────────────────────────────────
const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  user:               process.env.DB_USER     || 'bloom',
  password:           process.env.DB_PASSWORD || 'bloompassword',
  database:           process.env.DB_NAME     || 'bloom',
  charset:            'utf8mb4',
  waitForConnections: true,
  connectionLimit:    10,
});

// ── MongoDB ───────────────────────────────────────────────────────────────────
const connectMongo = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/bloom_logs';
  await mongoose.connect(uri);
  console.log('MongoDB connecté');
};

module.exports = { pool, connectMongo };
