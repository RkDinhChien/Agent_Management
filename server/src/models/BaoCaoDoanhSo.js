const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BaoCaoDoanhSo = sequelize.define('BaoCaoDoanhSo', {
  MaBCDS: {
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
    field: 'Nam',
  },
  TongDoanhSo: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,  
  },
}, {
  tableName: 'BAOCAODOANHSO',
  timestamps: false,
});

module.exports = BaoCaoDoanhSo;
