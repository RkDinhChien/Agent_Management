const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MatHang = sequelize.define('MatHang', {
  MaMatHang: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'MaMatHang',
  },
  TenMatHang: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'TenMatHang',
  },
  MaDVT: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'MaDVT',
  },
  DonGiaHienTai: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'DonGiaHienTai',
  },
  SoLuongTon: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'TonKho',
  },
}, {
  tableName: 'MATHANG',
  timestamps: true,
});

module.exports = MatHang;
