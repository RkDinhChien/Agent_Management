const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PhieuXuatHang = sequelize.define('PhieuXuatHang', {
  MaPhieuXuat: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  MaDaiLy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  NgayLapPhieu: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  TongTien: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  TienTra: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  ConLai: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
}, {
  tableName: 'PHIEUXUATHANG',
  timestamps: false,
});

module.exports = PhieuXuatHang;
