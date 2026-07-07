const express    = require('express');
const router     = express.Router();
const { getUsuarios, crearUsuario, toggleEstadoUsuario, eliminarUsuario } = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');
const checkRole   = require('../middleware/checkRole');

router.get('/',                 verifyToken, checkRole('admin'), getUsuarios);
router.post('/',                verifyToken, checkRole('admin'), crearUsuario);
router.patch('/:id/estado',     verifyToken, checkRole('admin'), toggleEstadoUsuario);
router.delete('/:id',           verifyToken, checkRole('admin'), eliminarUsuario);

module.exports = router;