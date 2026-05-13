const express = require('express');
const router = express.Router();
const { mockLoaiDaiLys } = require('../mockData');

router.get('/', (req, res) => {
  res.json({ status: 'success', data: mockLoaiDaiLys });
});

module.exports = router;
