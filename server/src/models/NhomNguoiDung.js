const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NhomNguoiDung = sequelize.define('NhomNguoiDung', {
  MaNhom: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  TenNhom: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'NHOMNGUOIDUNG',
  timestamps: false,
});

module.exports = NhomNguoiDung;
