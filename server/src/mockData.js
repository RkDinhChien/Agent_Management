// Mock Data cho API
const mockDaiLys = [
  {
    MaDaiLy: 1,
    TenDaiLy: 'Đại Lý Kim Quang',
    MaLoai: 1,
    MaQuan: 1,
    DiaChi: '123 Nguyễn Huệ, Q1, TPHCM',
    DienThoai: '0909123456',
    Email: 'kimquang@example.com',
    TienNo: 25000000,
    NgayTiepNhan: '2025-01-15',
    loaiDaiLy: { MaLoai: 1, TenLoai: 'Loại 1' },
    quan: { MaQuan: 1, TenQuan: 'Quận 1' }
  },
  {
    MaDaiLy: 2,
    TenDaiLy: 'Đại Lý Tân Bình',
    MaLoai: 2,
    MaQuan: 2,
    DiaChi: '456 Hoàng Văn Thụ, Q.Tân Bình, TPHCM',
    DienThoai: '0908765432',
    Email: 'tanbình@example.com',
    TienNo: 45000000,
    NgayTiepNhan: '2024-12-20',
    loaiDaiLy: { MaLoai: 2, TenLoai: 'Loại 2' },
    quan: { MaQuan: 2, TenQuan: 'Quận Tân Bình' }
  },
  {
    MaDaiLy: 3,
    TenDaiLy: 'Đại Lý Hóc Môn',
    MaLoai: 1,
    MaQuan: 3,
    DiaChi: '789 Trần Văn Giàu, Hóc Môn, TPHCM',
    DienThoai: '0907654321',
    Email: 'hocmon@example.com',
    TienNo: 12000000,
    NgayTiepNhan: '2025-02-01',
    loaiDaiLy: { MaLoai: 1, TenLoai: 'Loại 1' },
    quan: { MaQuan: 3, TenQuan: 'Hóc Môn' }
  },
  {
    MaDaiLy: 4,
    TenDaiLy: 'Đại Lý Lan Anh',
    MaLoai: 2,
    MaQuan: 1,
    DiaChi: '321 Lê Lợi, Q1, TPHCM',
    DienThoai: '0906543210',
    Email: 'lananh@example.com',
    TienNo: 0,
    NgayTiepNhan: '2025-02-10',
    loaiDaiLy: { MaLoai: 2, TenLoai: 'Loại 2' },
    quan: { MaQuan: 1, TenQuan: 'Quận 1' }
  }
];

const mockQuans = [
  { MaQuan: 1, TenQuan: 'Quận 1' },
  { MaQuan: 2, TenQuan: 'Quận Tân Bình' },
  { MaQuan: 3, TenQuan: 'Hóc Môn' },
  { MaQuan: 4, TenQuan: 'Quận 3' },
  { MaQuan: 5, TenQuan: 'Quận 5' }
];

const mockLoaiDaiLys = [
  { MaLoai: 1, TenLoai: 'Loại 1' },
  { MaLoai: 2, TenLoai: 'Loại 2' }
];

module.exports = {
  mockDaiLys,
  mockQuans,
  mockLoaiDaiLys
};
