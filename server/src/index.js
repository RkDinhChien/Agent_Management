const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Hệ thống Quản lý Đại lý đang hoạt động',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/dai-ly', require('./routes/daily.routes'));
app.use('/api/mat-hang', require('./routes/mathang.routes'));
app.use('/api/phieu-nhap', require('./routes/phieunhap.routes'));
app.use('/api/phieu-xuat', require('./routes/phieuxuat.routes'));
app.use('/api/phieu-thu', require('./routes/phieuthu.routes'));
app.use('/api/don-vi-tinh', require('./routes/donvitinh.routes'));
app.use('/api/nhom-nguoi-dung', require('./routes/nhomnguoidung.routes'));
app.use('/api/nguoi-dung', require('./routes/nguoidung.routes'));
app.use('/api/phan-quyen', require('./routes/phanquyen.routes'));
app.use('/api/chuc-nang', require('./routes/chucnang.routes'));
app.use('/api/bao-cao', require('./routes/baocao.routes'));
app.use('/api/tham-so', require('./routes/thamso.routes'));
app.use('/api/quan', require('./routes/quan.routes'));
app.use('/api/loai-dai-ly', require('./routes/loaidaily.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Đã xảy ra lỗi từ server',
  });
});

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối MySQL thành công'); ///??????

    // if (process.env.NODE_ENV === 'development') {
    //   await sequelize.sync({ alter: true });
    //   console.log('✅ Đồng bộ database thành công');
    // }

    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
      console.log(`📚 API Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Không thể kết nối database:', error.message);
    console.log('⚠️  Server vẫn chạy nhưng không có database');
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT} (không có DB)`);
    });
  }
};

startServer();
