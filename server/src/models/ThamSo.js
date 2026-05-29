const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ThamSo = sequelize.define('ThamSo', {
  SoDaiLyToiDa: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
  },
  TiLeTinhDonGiaXuat: {
    type: DataTypes.DECIMAL(5,2),
    defaultValue: 1.02,
  },
  ApDungQDKiemTraSoTienThu: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'THAMSO',
  timestamps: false,
});

module.exports = ThamSo;
