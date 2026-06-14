// controllers/goalController.js — logique métier des objectifs
const GoalModel = require('../models/GoalModel');
const LogModel  = require('../models/LogModel');

function sanitizeString(str, maxLen = 255) {
  return String(str).replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, maxLen);
}

function isValidId(id) {
  return Number.isInteger(id) && id > 0;
}

const goalController = {

  // GET /api/goals/with-streaks
  async getAll(req, res) {
    try {
      const goals = await GoalModel.findAllWithStreaks();
      res.json(goals);
    } catch {
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  },

  // POST /api/goals
  async create(req, res) {
    const rawTitle = req.body?.title;
    const rawIcon  = req.body?.icon ?? '🌱';

    if (!rawTitle) return res.status(400).json({ error: 'Le champ title est requis.' });

    const title = sanitizeString(rawTitle, 255);
    const icon  = sanitizeString(rawIcon, 10);
    if (!title)  return res.status(400).json({ error: 'Titre invalide.' });

    try {
      const goal = await GoalModel.create(title, icon);
      await LogModel.create('add_goal', goal.id, goal.title);
      res.status(201).json(goal);
    } catch {
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  },

  // DELETE /api/goals/:id
  async remove(req, res) {
    const id = parseInt(req.params.id, 10);
    if (!isValidId(id)) return res.status(400).json({ error: 'ID invalide.' });

    try {
      const goal = await GoalModel.findById(id);
      if (!goal) return res.status(404).json({ error: 'Objectif introuvable.' });

      await GoalModel.delete(id);
      await LogModel.create('delete_goal', id, goal.title);
      res.status(204).end();
    } catch {
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  },
};

module.exports = goalController;
