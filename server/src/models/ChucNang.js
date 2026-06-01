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
  TenManHinhDuocLoad: {
    type: DataTypes.STRING(30),
  },
}, {
  tableName: 'CHUCNANG',
  timestamps: false,
});

module.exports = ChucNang;
