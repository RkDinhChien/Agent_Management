const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CT_PXH = sequelize.define('CT_PXH', {
  MaPX: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  MaMatHang: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  SoLuong: {
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
  tableName: 'CT_PXH',
  timestamps: false,
});

module.exports = CT_PXH;
