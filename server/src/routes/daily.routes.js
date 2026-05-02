const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove, checkQuan, getLichSu } = require('../controllers/daily.controller');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getAll);
router.get('/check-quan/:maQuan', checkQuan);
router.get('/:id/lich-su', getLichSu);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
