const jwt = require('jsonwebtoken');
const { NguoiDung, NhomNguoiDung, ChucNang } = require('../models');

/**
 * POST /api/auth/login
 * Đăng nhập hệ thống
 */
const login = async (req, res) => {
  try {
    const { tenDangNhap, matKhau } = req.body;

    if (!tenDangNhap || !matKhau) {
      return res.status(400).json({
        status: 'error',
        message: 'Vui lòng nhập tên đăng nhập và mật khẩu.',
      });
    }

    // Tìm user
    const user = await NguoiDung.findOne({
      where: { TenNguoiDung: tenDangNhap },
      include: [
        {
          model: NhomNguoiDung,
          as: 'nhomNguoiDung',
          include: [{ model: ChucNang, as: 'chucNangs' }],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Tên đăng nhập hoặc mật khẩu không đúng.',
      });
    }

    // Kiểm tra mật khẩu
    const isValid = await user.kiemTraMatKhau(matKhau);
    if (!isValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Tên đăng nhập hoặc mật khẩu không đúng.',
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        TenNguoiDung: user.TenNguoiDung,
        MaNhom: user.MaNhom,
        role: user.nhomNguoiDung.TenNhom,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Lấy danh sách quyền
    const permissions = user.nhomNguoiDung.chucNangs.map((cn) => ({
      MaChucNang: cn.MaChucNang,
      TenChucNang: cn.TenChucNang,
      TenManHinhDuocLoad: cn.TenManHinhDuocLoad,
    }));

    res.json({
      status: 'success',
      message: 'Đăng nhập thành công',
      token,
      user: {
        TenNguoiDung: user.TenNguoiDung,
        role: user.nhomNguoiDung.TenNhom,
        permissions,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi đăng nhập.',
    });
  }
};

/**
 * GET /api/auth/me
 * Lấy thông tin user hiện tại
 */
const getMe = async (req, res) => {
  try {
    const user = await NguoiDung.findByPk(req.user.TenNguoiDung, {
      attributes: { exclude: ['MatKhau'] },
      include: [
        {
          model: NhomNguoiDung,
          as: 'nhomNguoiDung',
          include: [{ model: ChucNang, as: 'chucNangs' }],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy người dùng.',
      });
    }

    res.json({ status: 'success', user });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server.',
    });
  }
};

module.exports = { login, getMe };
