const jwt = require('jsonwebtoken');

const httpMethodToAction = (method) => {
  switch (method) {
    case 'POST': return 'Them';
    case 'PUT':
    case 'PATCH': return 'Sua';
    case 'DELETE': return 'Xoa';
    default: return 'Xem';
  }
};

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
    req.user.permissions = decoded.permissions || [];
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

/**
 * Middleware phân quyền theo chức năng màn hình và hành động
 */
const authorizePermission = (screenName, action) => {
  return (req, res, next) => {
    if (req.user.role === 'Admin') return next();

    const requiredAction = action || httpMethodToAction(req.method);
    const perm = (req.user.permissions || []).find((p) => p.TenManHinhDuocLoad === screenName);

    if (!perm || !perm[requiredAction]) {
      return res.status(403).json({
        status: 'error',
        message: 'Bạn không có quyền truy cập tài nguyên này.',
      });
    }

    next();
  };
};

module.exports = { authenticateToken, authorizeRoles, authorizePermission };
