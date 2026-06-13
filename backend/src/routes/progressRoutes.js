const express    = require('express');
const router     = express.Router();
const { marcarLeccion, getProgreso } = require('../controllers/progressController');
const verifyToken = require('../middleware/verifyToken');
const checkRole   = require('../middleware/checkRole');

router.put('/:cursoId/leccion/:leccionId', verifyToken, checkRole('alumno'), marcarLeccion);
router.get('/:cursoId',                   verifyToken, checkRole('alumno'), getProgreso);

module.exports = router;