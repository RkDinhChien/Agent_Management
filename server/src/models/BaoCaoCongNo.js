const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BaoCaoCongNo = sequelize.define('BaoCaoCongNo', {
  Thang: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  Nam: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  MaDaiLy: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  NoDau: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  PhatSinh: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  NoCuoi: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
}, {
  tableName: 'BAOCAOCONGNO',
  timestamps: true,
});

module.exports = BaoCaoCongNo;
