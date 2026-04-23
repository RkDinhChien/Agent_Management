const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PhieuXuatHang = sequelize.define('PhieuXuatHang', {
  MaPX: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  MaDaiLy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  NgayXuat: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  TongTien: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
}, {
  tableName: 'PHIEUXUATHANG',
  timestamps: true,
});

module.exports = PhieuXuatHang;
