// routes/checks.js
const express          = require('express');
const router           = express.Router();
const checkController  = require('../controllers/checkController');

// POST /api/checks  → MySQL (coche journalière) + MongoDB (log)
router.post('/', checkController.toggle);

module.exports = router;
