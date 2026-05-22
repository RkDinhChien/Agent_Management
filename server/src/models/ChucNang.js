const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChucNang = sequelize.define('ChucNang', {
  MaChucNang: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  TenChucNang: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  TenManHinh: {
    type: DataTypes.STRING(100),
    field: 'TenManHinhDuocLoad',
  },
}, {
  tableName: 'CHUCNANG',
  timestamps: true,
});

module.exports = ChucNang;
