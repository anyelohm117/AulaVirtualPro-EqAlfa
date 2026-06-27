const express     = require('express');
const router      = express.Router();
const { submitQuiz, getResultado, getQuizById, getQuizzesByCurso, getMisResultados } = require('../controllers/quizController');
const verifyToken = require('../middleware/verifyToken');
const checkRole   = require('../middleware/checkRole');

// Rutas para el manejo de Quizzes (Acceso exclusivo para alumnos)
router.get('/resultados/mios', verifyToken, checkRole('alumno'), getMisResultados);
router.get('/:id',            verifyToken, checkRole('alumno'), getQuizById);
router.post('/:id/submit',    verifyToken, checkRole('alumno'), submitQuiz);
router.get('/:id/resultado',  verifyToken, checkRole('alumno'), getResultado);
router.get('/curso/:cursoId', verifyToken, getQuizzesByCurso);

module.exports = router;