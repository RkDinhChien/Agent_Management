const express = require('express');
const router = express.Router();
const { getAll, getById, create } = require('../controllers/phieunhap.controller');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);

module.exports = router;
