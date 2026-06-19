const express     = require('express');
const router      = express.Router();
const { getCursos, getCursoById, crearCurso, actualizarCurso, eliminarCurso } = require('../controllers/courseController');
const verifyToken = require('../middleware/verifyToken');
const checkRole   = require('../middleware/checkRole');

router.get('/',    getCursos);
router.get('/:id', getCursoById);
router.post('/',   verifyToken, checkRole('admin', 'instructor'), crearCurso);
router.put('/:id', verifyToken, checkRole('admin', 'instructor'), actualizarCurso);
router.delete('/:id', verifyToken, checkRole('admin'), eliminarCurso);
router.get('/:cursoId/lecciones/:leccionId/materiales', verifyToken, getMaterialesLeccion);

module.exports = router;
