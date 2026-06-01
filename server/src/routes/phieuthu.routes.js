const express = require('express');
const router = express.Router();
const { getAll, create } = require('../controllers/phieuthu.controller');
const { authenticateToken, authorizePermission } = require('../middleware/auth');

router.use(authenticateToken);
router.use(authorizePermission('ThuTienView'));

router.get('/', getAll);
router.post('/', create);

module.exports = router;
