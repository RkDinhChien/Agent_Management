const express = require('express');
const router = express.Router();
const { getAll } = require('../controllers/loaidaily.controller');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);
router.get('/', getAll);

module.exports = router;
