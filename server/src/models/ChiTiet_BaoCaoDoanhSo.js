const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChiTiet_BaoCaoDoanhSo = sequelize.define('ChiTiet_BaoCaoDoanhSo', {
    MaBCDS: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    MaDaiLy: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    SoLuongPhieuXuat: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    TongTriGia: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
    },
    TiLe: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },
}, {
    tableName: 'CHITIET_BAOCAODOANHSO',
    timestamps: false,
});

module.exports = ChiTiet_BaoCaoDoanhSo;
