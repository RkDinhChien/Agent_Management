const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/nguoidung.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authorizeRoles('Admin'), create);
router.put('/:id', authorizeRoles('Admin'), update);
router.delete('/:id', authorizeRoles('Admin'), remove);

module.exports = router;
