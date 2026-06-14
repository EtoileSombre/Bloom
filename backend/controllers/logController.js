// controllers/logController.js — logique métier des logs d'activité (NoSQL)
const LogModel = require('../models/LogModel');

function isValidId(id) {
  return Number.isInteger(id) && id > 0;
}

const logController = {

  // GET /api/logs
  async getAll(req, res) {
    try {
      const logs = await LogModel.findAll();
      res.json(logs);
    } catch {
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  },

  // GET /api/logs/:goalId
  async getByGoal(req, res) {
    const id = parseInt(req.params.goalId, 10);
    if (!isValidId(id)) return res.status(400).json({ error: 'ID invalide.' });

    try {
      const logs = await LogModel.findByGoalId(id);
      res.json(logs);
    } catch {
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  },
};

module.exports = logController;
