const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const NguoiDung = sequelize.define('NguoiDung', {
  TenNguoiDung: {
    type: DataTypes.STRING(30),
    primaryKey: true,
    field: 'TenNguoiDung',
  },
  MatKhau: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'MatKhau',
  },
  MaNhom: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'MaNhom',
  },
}, {
  tableName: 'NGUOIDUNG',
  timestamps: false,
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
