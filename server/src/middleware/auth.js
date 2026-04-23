const jwt = require('jsonwebtoken');

/**
 * Middleware xác thực JWT token
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Chưa đăng nhập. Vui lòng cung cấp token.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      status: 'error',
      message: 'Token không hợp lệ hoặc đã hết hạn.',
    });
  }
};

/**
 * Middleware phân quyền theo role
 * @param  {...string} roles - Các role được phép truy cập
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Bạn không có quyền truy cập tài nguyên này.',
      });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };
