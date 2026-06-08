const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PhieuNhapHang = sequelize.define('PhieuNhapHang', {
  MaPhieuNhap: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  NgayLapPhieu: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  TongTien: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
}, {
  tableName: 'PHIEUNHAPHANG',
  timestamps: false,
});

module.exports = PhieuNhapHang;
