// models/CheckModel.js — accès aux données SQL (table daily_checks)
const { pool } = require('../config/db');

const CheckModel = {

  // Coche un objectif pour aujourd'hui
  async check(goalId) {
    const today = new Date().toISOString().slice(0, 10);
    await pool.query(
      'INSERT IGNORE INTO daily_checks (goal_id, checked_on) VALUES (?, ?)',
      [goalId, today]
    );
  },

  // Décoche un objectif pour aujourd'hui
  async uncheck(goalId) {
    const today = new Date().toISOString().slice(0, 10);
    await pool.query(
      'DELETE FROM daily_checks WHERE goal_id = ? AND checked_on = ?',
      [goalId, today]
    );
  },
};

module.exports = CheckModel;
