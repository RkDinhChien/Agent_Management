const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const NguoiDung = sequelize.define('NguoiDung', {
  MaNguoiDung: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  TenDangNhap: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  MatKhau: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  HoTen: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING(100),
  },
  MaNhom: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  TrangThai: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'NGUOIDUNG',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.MatKhau) {
        user.MatKhau = await bcrypt.hash(user.MatKhau, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('MatKhau')) {
        user.MatKhau = await bcrypt.hash(user.MatKhau, 10);
      }
    },
  },
});

// Instance method: kiểm tra mật khẩu
NguoiDung.prototype.kiemTraMatKhau = async function (password) {
  return bcrypt.compare(password, this.MatKhau);
};

module.exports = NguoiDung;
