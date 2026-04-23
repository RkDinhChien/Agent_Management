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
}, {
  tableName: 'PHANQUYEN',
  timestamps: false,
});

module.exports = PhanQuyen;
