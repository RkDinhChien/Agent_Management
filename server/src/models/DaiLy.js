const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DaiLy = sequelize.define('DaiLy', {
  MaDaiLy: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'MaDaiLy',
  },
  TenDaiLy: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'TenDaiLy',
  },
  MaLoai: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'MaLoaiDaiLy',
  },
  MaQuan: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'MaQuan',
  },
  DienThoai: {
    type: DataTypes.STRING(15),
    field: 'SDT',
  },
  DiaChi: {
    type: DataTypes.STRING(255),
    field: 'DiaChi',
  },
  Email: {
    type: DataTypes.STRING(100),
    field: 'Email',
  },
  NgayTiepNhan: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'NgayTiepNhan',
  },
  TienNo: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    field: 'TongNo',
  },
}, {
  tableName: 'DAILY',
  timestamps: true,
});

module.exports = DaiLy;
