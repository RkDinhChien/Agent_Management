const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BaoCaoDoanhSo = sequelize.define('BaoCaoDoanhSo', {
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
  SoPhieuXuat: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  TongTriGia: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  TyLe: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
  },
}, {
  tableName: 'BAOCAODOANHSO',
  timestamps: true,
});

module.exports = BaoCaoDoanhSo;
