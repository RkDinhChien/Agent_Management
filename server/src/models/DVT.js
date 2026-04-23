const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DVT = sequelize.define('DVT', {
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
  tableName: 'DVT',
  timestamps: true,
});

module.exports = DVT;
