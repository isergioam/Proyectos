const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const rankingController = require('../controllers/rankingController');
const authenticate = require('../middlewares/jwt');
const authorize = require('../middlewares/roles');
const { challengeValidation } = require('../validations/challenges');

router.get('/', challengeController.getAll);
router.get('/my-challenges', authenticate, challengeController.getMyChallenges);
router.get('/ranking/:id', rankingController.getRanking);
router.get('/:id', challengeController.getById);
router.post('/', authenticate, authorize('admin'), challengeValidation, challengeController.create);
router.put('/:id', authenticate, authorize('admin'), challengeValidation, challengeController.update);
router.delete('/:id', authenticate, authorize('admin'), challengeController.remove);
router.post('/:id/join', authenticate, challengeController.join);
router.delete('/:id/leave', authenticate, challengeController.leave);

module.exports = router;
