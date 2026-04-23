const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CT_PNH = sequelize.define('CT_PNH', {
  MaPN: {
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
  DonGiaNhap: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  ThanhTien: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
}, {
  tableName: 'CT_PNH',
  timestamps: false,
});

module.exports = CT_PNH;
