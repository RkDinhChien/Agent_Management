const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BaoCaoCongNo = sequelize.define('BaoCaoCongNo', {
  MaBC: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Thang: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Nam: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  MaDaiLy: {
    type: DataTypes.INTEGER,
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
