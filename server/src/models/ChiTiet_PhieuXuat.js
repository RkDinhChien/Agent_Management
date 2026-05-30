const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChiTiet_PhieuXuat = sequelize.define('ChiTiet_PhieuXuat', {
  MaPhieuXuat: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  MaMatHang: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  SoLuongXuat: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  DonGiaXuat: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  ThanhTien: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
}, {
  tableName: 'CHITIET_PHIEUXUAT',
  timestamps: false,
});

module.exports = ChiTiet_PhieuXuat;
