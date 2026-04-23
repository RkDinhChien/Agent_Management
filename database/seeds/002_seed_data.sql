-- =============================================
-- Quản Lý Đại Lý - Seed Data
-- SE104 - Nhập môn Công nghệ Phần mềm
-- =============================================

USE quan_ly_dai_ly;

-- Nhóm người dùng
INSERT INTO NHOMNGUOIDUNG (TenNhom) VALUES
  ('Admin'),
  ('Nhân viên');

-- Chức năng hệ thống
INSERT INTO CHUCNANG (TenChucNang, TenManHinh) VALUES
  ('Tiếp nhận đại lý', 'DaiLyView'),
  ('Lập phiếu nhập hàng', 'PhieuNhapView'),
  ('Lập phiếu xuất hàng', 'PhieuXuatView'),
  ('Tra cứu đại lý', 'TraCuuView'),
  ('Lập phiếu thu tiền', 'ThuTienView'),
  ('Báo cáo doanh số', 'BaoCaoView'),
  ('Báo cáo công nợ', 'BaoCaoView'),
  ('Cài đặt quy định', 'CaiDatView');

-- Phân quyền: Admin có toàn quyền
INSERT INTO PHANQUYEN (MaNhom, MaChucNang) VALUES
  (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8);

-- Phân quyền: Nhân viên chỉ lập phiếu và tra cứu
INSERT INTO PHANQUYEN (MaNhom, MaChucNang) VALUES
  (2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7);

-- Tài khoản admin mặc định (password: admin123 - đã hash bcrypt)
INSERT INTO NGUOIDUNG (TenDangNhap, MatKhau, HoTen, Email, MaNhom) VALUES
  ('admin', '$2a$10$rQkXKB5pIqkExmhJ5hGSO.gVVxZqAHfPGYqKPqYqAuFbJfuCxYn2a', 'Quản trị viên', 'admin@quanlydaily.com', 1);

-- Loại Đại lý
INSERT INTO LOAIDAILY (TenLoai, SoNoToiDa) VALUES
  ('Loại 1', 20000000),
  ('Loại 2', 10000000);

-- Quận
INSERT INTO QUAN (TenQuan) VALUES
  ('Quận 1'), ('Quận 2'), ('Quận 3'), ('Quận 4'), ('Quận 5'),
  ('Quận 6'), ('Quận 7'), ('Quận 8'), ('Quận 9'), ('Quận 10'),
  ('Quận 11'), ('Quận 12'), ('Quận Bình Thạnh'), ('Quận Gò Vấp'),
  ('Quận Phú Nhuận'), ('Quận Tân Bình'), ('Quận Tân Phú'), 
  ('Quận Bình Tân'), ('Quận Thủ Đức');

-- Đơn vị tính
INSERT INTO DVT (TenDVT) VALUES
  ('Cái'), ('Hộp'), ('Thùng'), ('Kg'), ('Lít');

-- Mặt hàng mẫu
INSERT INTO MATHANG (TenMatHang, MaDVT, SoLuongTon) VALUES
  ('Nước ngọt Coca Cola', 3, 200),
  ('Nước suối Aquafina', 3, 300),
  ('Mì gói Hảo Hảo', 3, 500),
  ('Dầu ăn Neptune', 2, 150),
  ('Sữa tươi Vinamilk', 2, 250);

-- Tham số hệ thống (QĐ1 - QĐ8)
INSERT INTO THAMSO (TenThamSo, GiaTri, MoTa) VALUES
  ('SoDaiLyToiDa', '4', 'QĐ1: Số đại lý tối đa trong một quận'),
  ('TyLeDonGiaXuat', '1.02', 'QĐ2: Tỷ lệ đơn giá xuất so với đơn giá nhập (102%)'),
  ('KiemTraTienNo', '1', 'QĐ3: Bật/tắt kiểm tra tiền nợ khi xuất hàng (1=bật, 0=tắt)'),
  ('KiemTraSoTienThu', '1', 'QĐ4: Bật/tắt kiểm tra số tiền thu <= tiền nợ (1=bật, 0=tắt)'),
  ('KiemTraSoLuongTon', '1', 'QĐ5: Bật/tắt kiểm tra số lượng tồn khi xuất (1=bật, 0=tắt)');

-- Đại lý mẫu
INSERT INTO DAILY (TenDaiLy, MaLoai, MaQuan, DienThoai, DiaChi, Email, NgayTiepNhan, TienNo) VALUES
  ('Đại lý Minh Phát', 1, 1, '0901234567', '123 Nguyễn Huệ', 'minhphat@gmail.com', '2025-01-15', 5000000),
  ('Đại lý Hoàng Long', 1, 3, '0912345678', '456 Lê Lợi', 'hoanglong@gmail.com', '2025-02-20', 8000000),
  ('Đại lý Thanh Tâm', 2, 5, '0923456789', '789 Trần Hưng Đạo', 'thanhtam@gmail.com', '2025-03-10', 3000000),
  ('Đại lý Phú Quý', 2, 7, '0934567890', '321 Hai Bà Trưng', 'phuquy@gmail.com', '2025-04-05', 7500000),
  ('Đại lý Tân Tiến', 1, 1, '0945678901', '654 Võ Văn Tần', 'tantien@gmail.com', '2025-05-01', 12000000);
