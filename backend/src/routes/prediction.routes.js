const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { submitPrediction, getUserPredictions } = require('../controllers/prediction.controller');

router.post('/', auth, submitPrediction);
router.get('/my', auth, getUserPredictions);

module.exports = router;