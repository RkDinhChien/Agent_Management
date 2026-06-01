const express = require('express');
const router = express.Router();
const { getAll, create, update, remove } = require('../controllers/mathang.controller');
const { authenticateToken, authorizePermission } = require('../middleware/auth');

router.use(authenticateToken);
router.use(authorizePermission('MatHangView'));

router.get('/', getAll);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
