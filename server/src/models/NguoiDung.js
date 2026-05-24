const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const NguoiDung = sequelize.define('NguoiDung', {
  TenNguoiDung: {
    type: DataTypes.STRING(30),
    primaryKey: true,
    allowNull: false,

  },
  MatKhau: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  MaNhom: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
