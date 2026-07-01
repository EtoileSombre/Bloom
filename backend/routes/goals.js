// routes/goals.js
const express        = require('express');
const router         = express.Router();
const goalController = require('../controllers/goalController');

// GET    /api/goals/with-streaks  → MySQL (objectifs + streaks + état du jour)
router.get('/with-streaks', goalController.getAll);

// POST   /api/goals               → MySQL (création) + MongoDB (log)
router.post('/',            goalController.create);

// DELETE /api/goals/:id           → MySQL (suppression) + MongoDB (log)
router.delete('/:id',       goalController.remove);

module.exports = router;
