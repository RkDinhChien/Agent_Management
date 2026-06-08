const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/phieunhap.controller');
const { authenticateToken, authorizePermission } = require('../middleware/auth');

router.use(authenticateToken);
router.use(authorizePermission('PhieuNhapView'));

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
