const express      = require('express');
const router       = express.Router();
const { getCursos, getCursoById, crearCurso, actualizarCurso, eliminarCurso, getMaterialesLeccion } = require('../controllers/courseController');
const { marcarLeccion } = require('../controllers/progressController');
const verifyToken  = require('../middleware/verifyToken');
const checkRole    = require('../middleware/checkRole');

router.get('/',    getCursos);
router.get('/:id', getCursoById);
router.post('/',   verifyToken, checkRole('admin', 'instructor'), crearCurso);
router.put('/:id', verifyToken, checkRole('admin', 'instructor'), actualizarCurso);
router.patch('/:id', verifyToken, checkRole('admin', 'instructor'), actualizarCurso);
router.delete('/:id', verifyToken, checkRole('admin', 'instructor'), eliminarCurso);

router.get('/:cursoId/lecciones/:leccionId/materiales', verifyToken, getMaterialesLeccion);
router.post('/:cursoId/lecciones/:leccionId/completar', verifyToken, checkRole('alumno'), marcarLeccion);

module.exports = router;