const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PhanQuyen = sequelize.define('PhanQuyen', {
  MaNhom: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  MaChucNang: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  Xem: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  Them: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  Xoa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  Sua: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'PHANQUYEN',
  timestamps: false,
});

module.exports = PhanQuyen;
