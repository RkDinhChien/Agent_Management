const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PhieuNhapHang = sequelize.define('PhieuNhapHang', {
  MaPN: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'MaPhieuNhap',
  },
  NgayNhap: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'NgayLapPhieu',
  },
  TongTien: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    field: 'TongTien',
  },
}, {
  tableName: 'PHIEUNHAPHANG',
  timestamps: true,
});

module.exports = PhieuNhapHang;
