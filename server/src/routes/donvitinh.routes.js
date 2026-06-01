const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/donvitinh.controller');
const { authenticateToken, authorizePermission } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getAll);
router.get('/:id', getById);
router.use(authorizePermission('CaiDatView'));
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
