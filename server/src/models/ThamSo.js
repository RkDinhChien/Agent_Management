const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ThamSo = sequelize.define('ThamSo', {
  SoDaiLyToiDa: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    field: 'SoDaiLyToiDa',
  },
  TiLeTinhDonGiaXuat: {
    type: DataTypes.DECIMAL(5,2),
    defaultValue: 1.02,
    field: 'TiLeTinhDonGiaXuat',
  },
  ApDungQDKiemTraSoTienThu: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'ApDungQDKiemTraSoTienThu',
  },
}, {
  tableName: 'THAMSO',
  timestamps: true,
});

module.exports = ThamSo;
