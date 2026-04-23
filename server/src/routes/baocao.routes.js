const express = require('express');
const router = express.Router();
const { getDoanhSo, getCongNo } = require('../controllers/baocao.controller');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/doanh-so', getDoanhSo);
router.get('/cong-no', getCongNo);

module.exports = router;
