const express = require('express');
const router = express.Router();
const { mockQuans } = require('../mockData');

router.get('/', (req, res) => {
  res.json({ status: 'success', data: mockQuans });
});

module.exports = router;
