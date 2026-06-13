const express    = require('express');
const router     = express.Router();
const { submitQuiz, getResultado } = require('../controllers/quizController');
const verifyToken = require('../middleware/verifyToken');
const checkRole   = require('../middleware/checkRole');

router.post('/:id/submit',    verifyToken, checkRole('alumno'), submitQuiz);
router.get('/:id/resultado',  verifyToken, checkRole('alumno'), getResultado);

module.exports = router;