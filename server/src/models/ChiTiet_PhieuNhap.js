const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CT_PNH = sequelize.define('CT_PNH', {
  MaPN: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    field: 'MaPhieuNhap',
  },
  MaMatHang: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    field: 'MaMatHang',
  },
  SoLuong: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'SoLuongNhap',
  },
  DonGiaNhap: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'DonGiaNhap',
  },
  ThanhTien: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'ThanhTien',
  },
}, {
  tableName: 'CHITIET_PHIEUNHAP',
  timestamps: false,
});

module.exports = CT_PNH;
