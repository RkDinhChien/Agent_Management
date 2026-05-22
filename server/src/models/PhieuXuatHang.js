const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PhieuXuatHang = sequelize.define('PhieuXuatHang', {
  MaPX: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'MaPhieuXuat',
  },
  MaDaiLy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'MaDaiLy',
  },
  NgayXuat: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'NgayLapPhieu',
  },
  TongTien: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    field: 'TongTien',
  },
  TienTra: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    field: 'TienTra',
  },
  ConLai: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    field: 'ConLai',
  },
}, {
  tableName: 'PHIEUXUATHANG',
  timestamps: true,
});

module.exports = PhieuXuatHang;
