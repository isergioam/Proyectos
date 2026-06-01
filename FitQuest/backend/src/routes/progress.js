const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authenticate = require('../middlewares/jwt');
const { progressValidation } = require('../validations/progress');

router.post('/', authenticate, progressValidation, progressController.logProgress);
router.get('/my-progress/:challengeId', authenticate, progressController.getMyProgress);

module.exports = router;
