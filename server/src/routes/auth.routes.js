const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', authenticateToken, getMe);

module.exports = router;
