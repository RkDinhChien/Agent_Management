const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quan = sequelize.define('Quan', {
  MaQuan: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  TenQuan: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'QUAN',
  timestamps: false,
});

module.exports = Quan;
