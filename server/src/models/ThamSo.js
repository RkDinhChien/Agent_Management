const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ThamSo = sequelize.define('ThamSo', {
  MaThamSo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  TenThamSo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  GiaTri: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  MoTa: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'THAMSO',
  timestamps: true,
});

module.exports = ThamSo;
