const express     = require('express');
const router      = express.Router();
const {
  getCursos, 
  getCursoById, 
  crearCurso, 
  actualizarCurso, 
  eliminarCurso,
  getMaterialesLeccion,
  addModulo, 
  updateModulo, 
  deleteModulo,
  addLeccion, 
  updateLeccion, 
  deleteLeccion
} = require('../controllers/courseController');
const { marcarLeccion } = require('../controllers/progressController');
const verifyToken  = require('../middleware/verifyToken');
const checkRole    = require('../middleware/checkRole');

// Cursos base
router.get('/',     verifyToken, getCursos);
router.get('/:id',  verifyToken, getCursoById);
router.post('/',    verifyToken, checkRole('admin', 'instructor'), crearCurso);
router.put('/:id',   verifyToken, checkRole('admin', 'instructor'), actualizarCurso);
router.patch('/:id', verifyToken, checkRole('admin', 'instructor'), actualizarCurso);
router.delete('/:id', verifyToken, checkRole('admin', 'instructor'), eliminarCurso);

// Materiales y progreso
router.get('/:cursoId/lecciones/:leccionId/materiales', verifyToken, getMaterialesLeccion);
router.post('/:cursoId/lecciones/:leccionId/completar', verifyToken, checkRole('alumno'), marcarLeccion);

// Módulos
router.post('/:id/modulos',                  verifyToken, checkRole('admin', 'instructor'), addModulo);
router.put('/:id/modulos/:moduloId',         verifyToken, checkRole('admin', 'instructor'), updateModulo);
router.delete('/:id/modulos/:moduloId',      verifyToken, checkRole('admin', 'instructor'), deleteModulo);

// Lecciones
router.post('/:id/modulos/:moduloId/lecciones',                    verifyToken, checkRole('admin', 'instructor'), addLeccion);
router.put('/:id/modulos/:moduloId/lecciones/:leccionId',          verifyToken, checkRole('admin', 'instructor'), updateLeccion);
router.delete('/:id/modulos/:moduloId/lecciones/:leccionId',       verifyToken, checkRole('admin', 'instructor'), deleteLeccion);

module.exports = router;