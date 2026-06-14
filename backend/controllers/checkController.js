// controllers/checkController.js — logique métier des coches journalières
const GoalModel  = require('../models/GoalModel');
const CheckModel = require('../models/CheckModel');
const LogModel   = require('../models/LogModel');

function isValidId(id) {
  return Number.isInteger(id) && id > 0;
}

const checkController = {

  // POST /api/checks
  async toggle(req, res) {
    const id      = parseInt(req.body?.goalId, 10);
    const checked = req.body?.checked;

    if (!isValidId(id))               return res.status(400).json({ error: 'goalId invalide.' });
    if (typeof checked !== 'boolean') return res.status(400).json({ error: 'checked doit être un booléen.' });

    try {
      const goal = await GoalModel.findById(id);
      if (!goal) return res.status(404).json({ error: 'Objectif introuvable.' });

      const today = new Date().toISOString().slice(0, 10);
      if (checked) {
        await CheckModel.check(id);
        await LogModel.create('check', id, goal.title, { date: today });
      } else {
        await CheckModel.uncheck(id);
        await LogModel.create('uncheck', id, goal.title, { date: today });
      }

      res.status(200).end();
    } catch {
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  },
};

module.exports = checkController;
