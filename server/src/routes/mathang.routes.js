const express = require('express');
const router = express.Router();
const { getAll, create, update, remove } = require('../controllers/mathang.controller');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getAll);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
