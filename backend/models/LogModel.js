// models/LogModel.js — accès aux données NoSQL (MongoDB)
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  action:    { type: String, required: true }, // 'add_goal' | 'delete_goal' | 'check' | 'uncheck'
  goalId:    Number,
  goalTitle: String,
  details:   mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
});

const Log = mongoose.model('Log', logSchema);

const LogModel = {

  // Enregistre une action
  async create(action, goalId, goalTitle, details = {}) {
    await Log.create({ action, goalId, goalTitle, details });
  },

  // Récupère les 50 dernières actions
  async findAll() {
    return Log.find().sort({ createdAt: -1 }).limit(50).lean();
  },

  // Récupère les actions d'un objectif
  async findByGoalId(goalId) {
    return Log.find({ goalId }).sort({ createdAt: -1 }).lean();
  },
};

module.exports = LogModel;
