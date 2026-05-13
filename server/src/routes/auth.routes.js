const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock login - no database needed
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Accept any username/password for testing
  if (!username || !password) {
    return res.status(400).json({ status: 'error', message: 'Username và password bắt buộc' });
  }
  
  const token = jwt.sign(
    { id: 1, username, email: `${username}@example.com` },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '7d' }
  );
  
  res.json({
    status: 'success',
    data: {
      token,
      user: { id: 1, username, email: `${username}@example.com` }
    }
  });
});

router.get('/me', (req, res) => {
  res.json({
    status: 'success',
    data: { id: 1, username: 'admin', email: 'admin@example.com' }
  });
});

module.exports = router;
