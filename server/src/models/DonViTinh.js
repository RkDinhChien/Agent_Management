const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DonViTinh = sequelize.define('DonViTinh', {
  MaDVT: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  TenDVT: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
}, {
  tableName: 'DONVITINH',
  timestamps: false,
});

module.exports = DonViTinh;
