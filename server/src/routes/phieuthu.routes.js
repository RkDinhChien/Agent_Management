const express = require('express');
const router = express.Router();
const { getAll, create } = require('../controllers/phieuthu.controller');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getAll);
router.post('/', create);

module.exports = router;
