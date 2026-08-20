const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/assistantController');
const verifyToken = require('../middleware/verifyToken');

router.post('/chat', verifyToken, chat);

module.exports = router;