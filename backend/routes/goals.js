// routes/goals.js
const express        = require('express');
const router         = express.Router();
const goalController = require('../controllers/goalController');

router.get('/with-streaks', goalController.getAll);
router.post('/',            goalController.create);
router.delete('/:id',       goalController.remove);

module.exports = router;
