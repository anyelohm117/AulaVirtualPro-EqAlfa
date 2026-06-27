const express    = require('express');
const router     = express.Router();
const { getReporteAdmin } = require('../controllers/reportController');
const verifyToken = require('../middleware/verifyToken');
const checkRole   = require('../middleware/checkRole');

router.get('/admin', verifyToken, checkRole('admin'), getReporteAdmin);

module.exports = router;