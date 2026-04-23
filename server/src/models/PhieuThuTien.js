const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PhieuThuTien = sequelize.define('PhieuThuTien', {
  MaPT: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  MaDaiLy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  NgayThu: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  SoTienThu: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
}, {
  tableName: 'PHIEUTHUTIEN',
  timestamps: true,
});

module.exports = PhieuThuTien;
