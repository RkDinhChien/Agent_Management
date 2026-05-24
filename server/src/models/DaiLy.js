const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DaiLy = sequelize.define('DaiLy', {
  MaDaiLy: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  TenDaiLy: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  MaLoaiDaiLy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  MaQuan: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  SDT: {
    type: DataTypes.STRING(15),
  },
  DiaChi: {
    type: DataTypes.STRING(255),
  },
  Email: {
    type: DataTypes.STRING(100),
  },
  NgayTiepNhan: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  TongNo: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
}, {
  tableName: 'DAILY',
  timestamps: true,
});

module.exports = DaiLy;
