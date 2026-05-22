const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PhieuThuTien = sequelize.define('PhieuThuTien', {
  MaPT: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'MaPhieuThu',
  },
  MaDaiLy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'MaDaiLy',
  },
  NgayThu: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'NgayThuTien',
  },
  SoTienThu: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'SoTienThu',
  },
}, {
  tableName: 'PHIEUTHUTIEN',
  timestamps: true,
});

module.exports = PhieuThuTien;
