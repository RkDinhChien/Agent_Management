const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChiTiet_PhieuNhap = sequelize.define('ChiTiet_PhieuNhap', {
  MaPhieuNhap: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  MaMatHang: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  SoLuongNhap: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  DonGiaNhap: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  ThanhTien: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
}, {
  tableName: 'CHITIET_PHIEUNHAP',
  timestamps: false,
});

module.exports = ChiTiet_PhieuNhap;
