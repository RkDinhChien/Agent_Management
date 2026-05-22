const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CT_PXH = sequelize.define('CT_PXH', {
  MaPX: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    field: 'MaPhieuXuat',
  },
  MaMatHang: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    field: 'MaMatHang',
  },
  SoLuong: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'SoLuongXuat',
  },
  DonGiaXuat: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'DonGiaXuat',
  },
  ThanhTien: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'ThanhTien',
  },
}, {
  tableName: 'CHITIET_PHIEUXUAT',
  timestamps: false,
});

module.exports = CT_PXH;
