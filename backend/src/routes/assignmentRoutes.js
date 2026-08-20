const express    = require('express');
const router     = express.Router();
const {
  crearTarea, getMisTareas, getTareasPorCurso,
  entregarTarea, getEntregas, eliminarTarea
} = require('../controllers/assignmentController');
const verifyToken = require('../middleware/verifyToken');
const checkRole   = require('../middleware/checkRole');

// Rutas estáticas primero
router.get('/mis-tareas',           verifyToken, checkRole('alumno'), getMisTareas);
router.get('/curso/:cursoId',       verifyToken, checkRole('instructor', 'admin'), getTareasPorCurso);
router.post('/',                    verifyToken, checkRole('instructor'), crearTarea);

// Rutas dinámicas
router.get('/:id/entregas',         verifyToken, checkRole('instructor', 'admin'), getEntregas);
router.post('/:id/entregar',        verifyToken, checkRole('alumno'), entregarTarea);
router.delete('/:id',               verifyToken, checkRole('instructor', 'admin'), eliminarTarea);

module.exports = router;