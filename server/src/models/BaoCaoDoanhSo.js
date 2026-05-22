const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BaoCaoDoanhSo = sequelize.define('BaoCaoDoanhSo', {
  MaBC: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'MaBCDS',
  },
  Thang: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'Thang',
  },
  Nam: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'Nam',
  },
  TongDoanhSo: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    field: 'TongDoanhSo',
  },
}, {
  tableName: 'BAOCAODOANHSO',
  timestamps: true,
});

module.exports = BaoCaoDoanhSo;
