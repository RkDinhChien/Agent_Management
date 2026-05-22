const sequelize = require('../config/database');

// Import all models
const NhomNguoiDung = require('./NhomNguoiDung');
const NguoiDung = require('./NguoiDung');
const ChucNang = require('./ChucNang');
const PhanQuyen = require('./PhanQuyen');
const LoaiDaiLy = require('./LoaiDaiLy');
const Quan = require('./Quan');
const DaiLy = require('./DaiLy');
const DVT = require('./DonViTinh');
const MatHang = require('./MatHang');
const PhieuNhapHang = require('./PhieuNhapHang');
const CT_PNH = require('./ChiTiet_PhieuNhap');
const PhieuXuatHang = require('./PhieuXuatHang');
const CT_PXH = require('./ChiTiet_PhieuXuat');
const PhieuThuTien = require('./PhieuThuTien');
const ThamSo = require('./ThamSo');
const BaoCaoDoanhSo = require('./BaoCaoDoanhSo');
const ChiTiet_BaoCaoDoanhSo = require('./ChiTiet_BaoCaoDoanhSo');
const BaoCaoCongNo = require('./BaoCaoCongNo');

// =============================================
// ASSOCIATIONS (Quan hệ giữa các bảng)
// =============================================

// Người dùng <-> Nhóm người dùng
NhomNguoiDung.hasMany(NguoiDung, { foreignKey: 'MaNhom', as: 'nguoiDungs' });
NguoiDung.belongsTo(NhomNguoiDung, { foreignKey: 'MaNhom', as: 'nhomNguoiDung' });

// Nhóm người dùng <-> Chức năng (Many-to-Many qua PHANQUYEN)
NhomNguoiDung.belongsToMany(ChucNang, {
  through: PhanQuyen,
  foreignKey: 'MaNhom',
  otherKey: 'MaChucNang',
  as: 'chucNangs',
});
ChucNang.belongsToMany(NhomNguoiDung, {
  through: PhanQuyen,
  foreignKey: 'MaChucNang',
  otherKey: 'MaNhom',
  as: 'nhomNguoiDungs',
});

// Đại lý <-> Loại đại lý
LoaiDaiLy.hasMany(DaiLy, { foreignKey: 'MaLoai', as: 'daiLys' });
DaiLy.belongsTo(LoaiDaiLy, { foreignKey: 'MaLoai', as: 'loaiDaiLy' });

// Đại lý <-> Quận
Quan.hasMany(DaiLy, { foreignKey: 'MaQuan', as: 'daiLys' });
DaiLy.belongsTo(Quan, { foreignKey: 'MaQuan', as: 'quan' });

// Mặt hàng <-> Đơn vị tính
DVT.hasMany(MatHang, { foreignKey: 'MaDVT', as: 'matHangs' });
MatHang.belongsTo(DVT, { foreignKey: 'MaDVT', as: 'dvt' });

// Phiếu nhập hàng <-> Chi tiết phiếu nhập
PhieuNhapHang.hasMany(CT_PNH, { foreignKey: 'MaPN', as: 'chiTiets' });
CT_PNH.belongsTo(PhieuNhapHang, { foreignKey: 'MaPN', as: 'phieuNhap' });

// Chi tiết phiếu nhập <-> Mặt hàng
MatHang.hasMany(CT_PNH, { foreignKey: 'MaMatHang', as: 'chiTietNhaps' });
CT_PNH.belongsTo(MatHang, { foreignKey: 'MaMatHang', as: 'matHang' });

// Phiếu xuất hàng <-> Đại lý
DaiLy.hasMany(PhieuXuatHang, { foreignKey: 'MaDaiLy', as: 'phieuXuats' });
PhieuXuatHang.belongsTo(DaiLy, { foreignKey: 'MaDaiLy', as: 'daiLy' });

// Phiếu xuất hàng <-> Chi tiết phiếu xuất
PhieuXuatHang.hasMany(CT_PXH, { foreignKey: 'MaPX', as: 'chiTiets' });
CT_PXH.belongsTo(PhieuXuatHang, { foreignKey: 'MaPX', as: 'phieuXuat' });

// Chi tiết phiếu xuất <-> Mặt hàng
MatHang.hasMany(CT_PXH, { foreignKey: 'MaMatHang', as: 'chiTietXuats' });
CT_PXH.belongsTo(MatHang, { foreignKey: 'MaMatHang', as: 'matHang' });

// Phiếu thu tiền <-> Đại lý
DaiLy.hasMany(PhieuThuTien, { foreignKey: 'MaDaiLy', as: 'phieuThus' });
PhieuThuTien.belongsTo(DaiLy, { foreignKey: 'MaDaiLy', as: 'daiLy' });

// Báo cáo doanh số <-> Đại lý
BaoCaoDoanhSo.hasMany(ChiTiet_BaoCaoDoanhSo, {
  foreignKey: 'MaBCDS',
  as: 'chiTietBaoCaoDoanhSos',
});
ChiTiet_BaoCaoDoanhSo.belongsTo(BaoCaoDoanhSo, {
  foreignKey: 'MaBCDS',
  as: 'baoCaoDoanhSo',
});

DaiLy.hasMany(ChiTiet_BaoCaoDoanhSo, {
  foreignKey: 'MaDaiLy',
  as: 'chiTietBaoCaoDoanhSos',
});
ChiTiet_BaoCaoDoanhSo.belongsTo(DaiLy, {
  foreignKey: 'MaDaiLy',
  as: 'daiLy',
});

// Báo cáo công nợ <-> Đại lý
DaiLy.hasMany(BaoCaoCongNo, { foreignKey: 'MaDaiLy', as: 'baoCaoCongNos' });
BaoCaoCongNo.belongsTo(DaiLy, { foreignKey: 'MaDaiLy', as: 'daiLy' });

module.exports = {
  sequelize,
  NhomNguoiDung,
  NguoiDung,
  ChucNang,
  PhanQuyen,
  LoaiDaiLy,
  Quan,
  DaiLy,
  DVT,
  MatHang,
  PhieuNhapHang,
  CT_PNH,
  PhieuXuatHang,
  CT_PXH,
  PhieuThuTien,
  ThamSo,
  BaoCaoDoanhSo,
  ChiTiet_BaoCaoDoanhSo,
  BaoCaoCongNo,
};
