const router = require('express').Router();
const { getMatches, getMatchQuestions } = require('../controllers/match.controller');

router.get('/', getMatches);
router.get('/:id/questions', getMatchQuestions);

module.exports = router;