const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MatHang = sequelize.define('MatHang', {
  MaMatHang: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  TenMatHang: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  MaDVT: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'MaDVT',
  },
  DonGiaHienTai: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  SoLuongTon: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'MATHANG',
  timestamps: false,
});

module.exports = MatHang;
