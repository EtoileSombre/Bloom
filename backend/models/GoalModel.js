// models/GoalModel.js — accès aux données SQL (table goals)
const { pool } = require('../config/db');

const GoalModel = {

  // Récupère tous les objectifs avec streak et état du jour
  async findAllWithStreaks() {
    const today = new Date().toISOString().slice(0, 10);

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

    return goals.map(g => {
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
  },

  // Crée un objectif
  async create(title, icon) {
    const [result] = await pool.query(
      'INSERT INTO goals (title, icon) VALUES (?, ?)', [title, icon]
    );
    const [rows] = await pool.query('SELECT * FROM goals WHERE id = ?', [result.insertId]);
    return rows[0];
  },

  // Récupère un objectif par id (pour vérification)
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM goals WHERE id = ?', [id]);
    return rows[0] || null;
  },

  // Supprime un objectif
  async delete(id) {
    await pool.query('DELETE FROM goals WHERE id = ?', [id]);
  },
};

module.exports = GoalModel;
