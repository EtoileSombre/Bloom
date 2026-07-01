// routes/logs.js
const express       = require('express');
const router        = express.Router();
const logController = require('../controllers/logController');

// GET /api/logs           → MongoDB (journal des 50 dernières actions)
router.get('/',         logController.getAll);

// GET /api/logs/:goalId   → MongoDB (actions d'un objectif)
router.get('/:goalId',  logController.getByGoal);

module.exports = router;
