// routes/checks.js
const express          = require('express');
const router           = express.Router();
const checkController  = require('../controllers/checkController');

router.post('/', checkController.toggle);

module.exports = router;
