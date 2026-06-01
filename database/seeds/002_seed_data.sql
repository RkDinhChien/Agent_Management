-- =============================================
-- Quản Lý Đại Lý - Seed Data
-- SE104 - Nhập môn Công nghệ Phần mềm
-- =============================================

USE quan_ly_dai_ly;

-- Nhóm người dùng
INSERT INTO NHOMNGUOIDUNG (TenNhom) VALUES
  ('Admin');


-- Chức năng hệ thống
INSERT INTO CHUCNANG (TenChucNang, TenManHinhDuocLoad) VALUES
  ('Tiếp nhận đại lý', 'DaiLyView'),
  ('Lập phiếu nhập hàng', 'PhieuNhapView'),
  ('Lập phiếu xuất hàng', 'PhieuXuatView'),
  ('Tra cứu đại lý', 'TraCuuView'),
  ('Lập phiếu thu tiền', 'ThuTienView'),
  ('Báo cáo doanh số', 'BaoCaoView'),
  ('Báo cáo công nợ', 'BaoCaoView'),
  ('Cài đặt quy định', 'CaiDatView'),
  ('Phân quyền', 'PhanQuyenView');

-- Phân quyền: Admin có toàn quyền
INSERT INTO PHANQUYEN (MaNhom, MaChucNang) VALUES
  (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8);


-- Tài khoản admin mặc định (password: admin123 - đã hash bcrypt)
INSERT INTO NGUOIDUNG (TenNguoiDung, MatKhau, MaNhom) VALUES
  ('admin', '$2b$10$QHnckkacG1dHmFB2/6/I..hESZwMp5Hxxkp9VeJN6Pv71RHTComem', 1);

-- ============================================================
-- INSERT DỮ LIỆU
-- ============================================================

-- THAM SỐ 
INSERT INTO THAMSO (Id, SoDaiLyToiDa, TiLeTinhDonGiaXuat, ApDungQDKiemTraSoTienThu)
VALUES (1, 4, 1.02, TRUE)
ON DUPLICATE KEY UPDATE
  SoDaiLyToiDa = VALUES(SoDaiLyToiDa),
  TiLeTinhDonGiaXuat = VALUES(TiLeTinhDonGiaXuat),
  ApDungQDKiemTraSoTienThu = VALUES(ApDungQDKiemTraSoTienThu);

-- LOẠI ĐẠI LÝ
INSERT INTO LOAIDAILY (TenLoaiDaiLy, TienNoToiDa) VALUES
('Loại 1', 10000000),
('Loại 2', 5000000);

-- QUẬN
INSERT INTO QUAN (TenQuan) VALUES
('Quận 1'),
('Quận 3'),
('Quận Bình Thạnh'),
('Quận Tân Bình');

-- ĐƠN VỊ TÍNH 
INSERT INTO DONVITINH (TenDVT) VALUES
('Thùng'),
('Chai'),
('Hộp'),
('Gói');

-- MẶT HÀNG
INSERT INTO MATHANG (TenMatHang, MaDVT, DonGiaHienTai, TonKho) VALUES
('Nước suối Lavie 500ml', 1, 0, 0),
('Nước ngọt Coca-Cola', 1, 0, 0),
('Mì gói Hảo Hảo', 3, 0, 0),
('Bánh quy bơ Đan Mạch', 3, 0, 0),
('Cà phê hòa tan G7', 4, 0, 0);

-- ĐẠI LÝ 
INSERT INTO DAILY
(TenDaiLy, MaLoaiDaiLy, MaQuan, SDT, DiaChi, Email, NgayTiepNhan, TongNo)
VALUES
('Đại lý Minh Anh', 1, 1, '0901234567', '12 Nguyễn Huệ, Quận 1', 'minhanh@example.com', '2026-01-05', 0),
('Đại lý Phú Thịnh', 1, 3, '0912345678', '45 Xô Viết Nghệ Tĩnh, Bình Thạnh', 'phuthinh@example.com', '2026-01-10', 0),
('Đại lý An Khang', 2, 2, '0923456789', '78 Võ Văn Tần, Quận 3', 'ankhang@example.com', '2026-02-01', 0),
('Đại lý Gia Hân', 2, 4, '0934567890', '23 Cộng Hòa, Tân Bình', 'giahan@example.com', '2026-02-15', 0);


-- PHIẾU NHẬP HÀNG
INSERT INTO PHIEUNHAPHANG (NgayLapPhieu) VALUES
('2026-03-01'),
('2026-03-05');

INSERT INTO CHITIET_PHIEUNHAP
(MaPhieuNhap, MaMatHang, SoLuongNhap, DonGiaNhap)
VALUES
(1, 1, 100, 80000),
(1, 2, 80, 150000),
(1, 3, 120, 90000),
(2, 4, 60, 120000),
(2, 5, 90, 65000);
 

INSERT INTO PHIEUXUATHANG (MaDaiLy, NgayLapPhieu, TienTra) VALUES
(1, '2026-03-10', 0),
(2, '2026-03-12', 0),
(3, '2026-03-15', 0);

INSERT INTO CHITIET_PHIEUXUAT
(MaPhieuXuat, MaMatHang, SoLuongXuat)
VALUES
(1, 1, 20),
(1, 2, 10),
(1, 3, 15),
(2, 2, 12),
(2, 4, 8),
(3, 3, 20),
(3, 5, 10);

INSERT INTO PHIEUTHUTIEN (MaDaiLy, NgayThuTien, SoTienThu) VALUES
(1, '2026-03-20', 1000000),
(2, '2026-03-22', 800000),
(3, '2026-03-25', 500000);
