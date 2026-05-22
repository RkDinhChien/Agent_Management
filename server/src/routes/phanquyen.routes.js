const express = require('express');
const router = express.Router();
const { getByGroup, replaceForGroup } = require('../controllers/phanquyen.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/:maNhom', getByGroup);
router.post('/', authorizeRoles('Admin'), replaceForGroup);

module.exports = router;
