// routes/logs.js
const express       = require('express');
const router        = express.Router();
const logController = require('../controllers/logController');

router.get('/',         logController.getAll);
router.get('/:goalId',  logController.getByGoal);

module.exports = router;
