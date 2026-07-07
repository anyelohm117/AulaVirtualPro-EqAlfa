const express    = require('express');
const router     = express.Router();
const {
  inscribirse, getMisCursos, getCursosDisponibles,
  inscribirAlumno, getAlumnosPorCurso
} = require('../controllers/inscripcionController');
const verifyToken = require('../middleware/verifyToken');
const checkRole   = require('../middleware/checkRole');

// Rutas estáticas primero
router.get('/mis-cursos',          verifyToken, checkRole('alumno'), getMisCursos);
router.get('/disponibles',         verifyToken, checkRole('alumno'), getCursosDisponibles);
router.post('/admin',              verifyToken, checkRole('admin'), inscribirAlumno);
router.get('/curso/:cursoId',      verifyToken, checkRole('admin', 'instructor'), getAlumnosPorCurso);

// Ruta dinámica al final
router.post('/:cursoId',           verifyToken, checkRole('alumno'), inscribirse);

module.exports = router;