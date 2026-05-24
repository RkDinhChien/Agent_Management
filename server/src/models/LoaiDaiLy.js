const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoaiDaiLy = sequelize.define('LoaiDaiLy', {
  MaLoaiDaiLy: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  TenLoaiDaiLy: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  TienNoToiDa: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'LOAIDAILY',
  timestamps: true,
});

module.exports = LoaiDaiLy;
