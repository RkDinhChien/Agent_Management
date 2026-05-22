const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoaiDaiLy = sequelize.define('LoaiDaiLy', {
  MaLoai: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'MaLoaiDaiLy',
  },
  TenLoai: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'TenLoaiDaiLy',
  },
  SoNoToiDa: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'TienNoToiDa',
  },
}, {
  tableName: 'LOAIDAILY',
  timestamps: true,
});

module.exports = LoaiDaiLy;
