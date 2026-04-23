const express = require('express');
const router = express.Router();
const { getAll, update } = require('../controllers/thamso.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getAll);
router.put('/:id', authorizeRoles('Admin'), update);

module.exports = router;
