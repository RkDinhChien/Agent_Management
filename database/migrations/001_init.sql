DROP DATABASE IF EXISTS quan_ly_dai_ly;
-- =============================================
-- Quản Lý Đại Lý - Database Schema
-- SE104 - Nhập môn Công nghệ Phần mềm
-- =============================================

CREATE DATABASE IF NOT EXISTS quan_ly_dai_ly
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE quan_ly_dai_ly;

-- ============================================================
-- NHÓM 1: NGƯỜI DÙNG VÀ PHÂN QUYỀN 
-- ============================================================

CREATE TABLE NHOMNGUOIDUNG (
  MaNhom INT AUTO_INCREMENT PRIMARY KEY,
  TenNhom VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE NGUOIDUNG (
  TenNguoiDung VARCHAR(30) PRIMARY KEY,
  MatKhau VARCHAR(100) NOT NULL,
  MaNhom INT NOT NULL,
  CONSTRAINT FK_NGUOIDUNG_MaNhom
    FOREIGN KEY (MaNhom) REFERENCES NHOMNGUOIDUNG(MaNhom)
) ENGINE=InnoDB;

CREATE TABLE CHUCNANG (
  MaChucNang INT AUTO_INCREMENT PRIMARY KEY,
  TenChucNang VARCHAR(100) NOT NULL UNIQUE,
  TenManHinhDuocLoad VARCHAR(30)
) ENGINE=InnoDB;

CREATE TABLE PHANQUYEN (
  MaNhom INT NOT NULL,
  MaChucNang INT NOT NULL,
  Xem BOOLEAN DEFAULT TRUE,
  Them BOOLEAN DEFAULT TRUE,
  Xoa BOOLEAN DEFAULT TRUE,
  Sua BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (MaNhom, MaChucNang),
  CONSTRAINT FK_PHANQUYEN_MaNhom
    FOREIGN KEY (MaNhom) REFERENCES NHOMNGUOIDUNG(MaNhom) ON DELETE CASCADE,
  CONSTRAINT FK_PHANQUYEN_MaChucNang
    FOREIGN KEY (MaChucNang) REFERENCES CHUCNANG(MaChucNang) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- NHÓM 2: ĐẠI LÝ 
-- ============================================================

CREATE TABLE LOAIDAILY (
  MaLoaiDaiLy INT AUTO_INCREMENT PRIMARY KEY,
  TenLoaiDaiLy VARCHAR(50) NOT NULL UNIQUE,
  TienNoToiDa DECIMAL(15,2) NOT NULL DEFAULT 0,
  CONSTRAINT CK_LOAIDAILY_TienNoToiDa CHECK (TienNoToiDa >= 0)
) ENGINE=InnoDB;

CREATE TABLE QUAN (
  MaQuan INT AUTO_INCREMENT PRIMARY KEY,
  TenQuan VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE DAILY (
  MaDaiLy INT AUTO_INCREMENT PRIMARY KEY,
  TenDaiLy VARCHAR(100) NOT NULL,
  MaLoaiDaiLy INT NOT NULL,
  MaQuan INT NOT NULL,
  SDT VARCHAR(15),
  DiaChi VARCHAR(255),
  Email VARCHAR(100),
  NgayTiepNhan DATE NOT NULL,
  TongNo DECIMAL(15,2) NOT NULL DEFAULT 0,
  CONSTRAINT FK_DAILY_MaLoaiDaiLy
    FOREIGN KEY (MaLoaiDaiLy) REFERENCES LOAIDAILY(MaLoaiDaiLy),
  CONSTRAINT FK_DAILY_MaQuan
    FOREIGN KEY (MaQuan) REFERENCES QUAN(MaQuan),
  CONSTRAINT CK_DAILY_TongNo CHECK (TongNo >= 0),
  CONSTRAINT CK_DAILY_Email
    CHECK (Email IS NULL OR Email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
  CONSTRAINT CK_DAILY_SDT
    CHECK (SDT IS NULL OR SDT REGEXP '^(0|\\+84)[0-9]{9,10}$')
) ENGINE=InnoDB;

-- ============================================================
-- NHÓM 3: HÀNG HÓA 
-- ============================================================

CREATE TABLE DONVITINH (
  MaDVT INT AUTO_INCREMENT PRIMARY KEY,
  TenDVT VARCHAR(30) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE MATHANG (
  MaMatHang INT AUTO_INCREMENT PRIMARY KEY,
  TenMatHang VARCHAR(100) NOT NULL UNIQUE,
  MaDVT INT NOT NULL,
  DonGiaHienTai DECIMAL(15,2) NOT NULL DEFAULT 0,
  TonKho INT NOT NULL DEFAULT 0,
  CONSTRAINT FK_MATHANG_MaDVT
    FOREIGN KEY (MaDVT) REFERENCES DONVITINH(MaDVT),
  CONSTRAINT CK_MATHANG_DonGiaHienTai CHECK (DonGiaHienTai >= 0),
  CONSTRAINT CK_MATHANG_TonKho CHECK (TonKho >= 0)
) ENGINE=InnoDB;

-- ============================================================
-- NHÓM 4: GIAO DỊCH 
-- ============================================================

CREATE TABLE PHIEUNHAPHANG (
  MaPhieuNhap INT AUTO_INCREMENT PRIMARY KEY,
  NgayLapPhieu DATE NOT NULL,
  TongTien DECIMAL(15,2) NOT NULL DEFAULT 0,
  CONSTRAINT CK_PHIEUNHAPHANG_TongTien CHECK (TongTien >= 0)
) ENGINE=InnoDB;

CREATE TABLE CHITIET_PHIEUNHAP (
  MaPhieuNhap INT NOT NULL,
  MaMatHang INT NOT NULL,
  SoLuongNhap INT NOT NULL,
  DonGiaNhap DECIMAL(15,2) NOT NULL,
  ThanhTien DECIMAL(15,2)
    GENERATED ALWAYS AS (SoLuongNhap * DonGiaNhap) STORED,
  PRIMARY KEY (MaPhieuNhap, MaMatHang),
  CONSTRAINT FK_CTPHIEUNHAP_MaPhieuNhap
    FOREIGN KEY (MaPhieuNhap) REFERENCES PHIEUNHAPHANG(MaPhieuNhap) ON DELETE CASCADE,
  CONSTRAINT FK_CTPHIEUNHAP_MaMatHang
    FOREIGN KEY (MaMatHang) REFERENCES MATHANG(MaMatHang),
  CONSTRAINT CK_CTPHIEUNHAP_SoLuongNhap CHECK (SoLuongNhap > 0),
  CONSTRAINT CK_CTPHIEUNHAP_DonGiaNhap CHECK (DonGiaNhap > 0),
  CONSTRAINT CK_CTPHIEUNHAP_ThanhTien CHECK (ThanhTien >= 0)
) ENGINE=InnoDB;

CREATE TABLE PHIEUXUATHANG (
  MaPhieuXuat INT AUTO_INCREMENT PRIMARY KEY,
  MaDaiLy INT NOT NULL,
  NgayLapPhieu DATE NOT NULL,
  TongTien DECIMAL(15,2) NOT NULL DEFAULT 0,
  TienTra DECIMAL(15,2) NOT NULL DEFAULT 0,
  ConLai DECIMAL(15,2)
    GENERATED ALWAYS AS (TongTien - TienTra) STORED,
  CONSTRAINT FK_PHIEUXUATHANG_MaDaiLy
    FOREIGN KEY (MaDaiLy) REFERENCES DAILY(MaDaiLy),
  CONSTRAINT CK_PHIEUXUATHANG_TienTra CHECK (TienTra >= 0),
  CONSTRAINT CK_PHIEUXUATHANG_ConLai CHECK (ConLai >= 0)
) ENGINE=InnoDB;

CREATE TABLE CHITIET_PHIEUXUAT (
  MaPhieuXuat INT NOT NULL,
  MaMatHang INT NOT NULL,
  SoLuongXuat INT NOT NULL,
  DonGiaXuat DECIMAL(15,2) NOT NULL DEFAULT 0,
  ThanhTien DECIMAL(15,2)
    GENERATED ALWAYS AS (SoLuongXuat * DonGiaXuat) STORED,
  PRIMARY KEY (MaPhieuXuat, MaMatHang),
  CONSTRAINT FK_CTPHIEUXUAT_MaPhieuXuat
    FOREIGN KEY (MaPhieuXuat) REFERENCES PHIEUXUATHANG(MaPhieuXuat) ON DELETE CASCADE,
  CONSTRAINT FK_CTPHIEUXUAT_MaMatHang
    FOREIGN KEY (MaMatHang) REFERENCES MATHANG(MaMatHang),
  CONSTRAINT CK_CTPHIEUXUAT_SoLuongXuat CHECK (SoLuongXuat > 0),
  CONSTRAINT CK_CTPHIEUXUAT_DonGiaXuat CHECK (DonGiaXuat >= 0),
  CONSTRAINT CK_CTPHIEUXUAT_ThanhTien CHECK (ThanhTien >= 0)
) ENGINE=InnoDB;

CREATE TABLE PHIEUTHUTIEN (
  MaPhieuThu INT AUTO_INCREMENT PRIMARY KEY,
  MaDaiLy INT NOT NULL,
  NgayThuTien DATE NOT NULL,
  SoTienThu DECIMAL(15,2) NOT NULL,
  CONSTRAINT FK_PHIEUTHUTIEN_MaDaiLy
    FOREIGN KEY (MaDaiLy) REFERENCES DAILY(MaDaiLy),
  CONSTRAINT CK_PHIEUTHUTIEN_SoTienThu CHECK (SoTienThu > 0)
) ENGINE=InnoDB;

-- ============================================================
-- NHÓM 5: THAM SỐ VÀ BÁO CÁO 
-- ============================================================

CREATE TABLE THAMSO (
  Id TINYINT PRIMARY KEY DEFAULT 1,
  SoDaiLyToiDa INT NOT NULL DEFAULT 100,
  TiLeTinhDonGiaXuat DECIMAL(5,2) NOT NULL DEFAULT 1.02,
  ApDungQDKiemTraSoTienThu BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT CK_THAMSO_Id CHECK (Id = 1),
  CONSTRAINT CK_THAMSO_SoDaiLyToiDa CHECK (SoDaiLyToiDa > 0),
  CONSTRAINT CK_THAMSO_TiLeTinhDonGiaXuat CHECK (TiLeTinhDonGiaXuat > 0)
) ENGINE=InnoDB;

CREATE TABLE BAOCAODOANHSO (
  MaBCDS INT AUTO_INCREMENT PRIMARY KEY,
  Thang INT NOT NULL,
  Nam INT NOT NULL,
  TongDoanhSo DECIMAL(15,2) NOT NULL DEFAULT 0,
  UNIQUE KEY UK_BAOCAODOANHSO_Thang_Nam (Thang, Nam),
  CONSTRAINT CK_BAOCAODOANHSO_Thang CHECK (Thang BETWEEN 1 AND 12),
  CONSTRAINT CK_BAOCAODOANHSO_Nam CHECK (Nam >= 2000),
  CONSTRAINT CK_BAOCAODOANHSO_TongDoanhSo CHECK (TongDoanhSo >= 0)
) ENGINE=InnoDB;

CREATE TABLE CHITIET_BAOCAODOANHSO (
  MaBCDS INT NOT NULL,
  MaDaiLy INT NOT NULL,
  SoLuongPhieuXuat INT NOT NULL DEFAULT 0,
  TongTriGia DECIMAL(15,2) NOT NULL DEFAULT 0,
  TiLe DECIMAL(8,4) NOT NULL DEFAULT 0,
  PRIMARY KEY (MaBCDS, MaDaiLy),
  CONSTRAINT FK_CTBAOCAODOANHSO_MaBCDS
    FOREIGN KEY (MaBCDS) REFERENCES BAOCAODOANHSO(MaBCDS) ON DELETE CASCADE,
  CONSTRAINT FK_CTBAOCAODOANHSO_MaDaiLy
    FOREIGN KEY (MaDaiLy) REFERENCES DAILY(MaDaiLy),
  CONSTRAINT CK_CTBAOCAODOANHSO_SoLuongPhieuXuat CHECK (SoLuongPhieuXuat >= 0),
  CONSTRAINT CK_CTBAOCAODOANHSO_TongTriGia CHECK (TongTriGia >= 0),
  CONSTRAINT CK_CTBAOCAODOANHSO_TiLe CHECK (TiLe >= 0)
) ENGINE=InnoDB;

CREATE TABLE BAOCAOCONGNO (
  Thang INT NOT NULL,
  Nam INT NOT NULL,
  MaDaiLy INT NOT NULL,
  NoDau DECIMAL(15,2) NOT NULL DEFAULT 0,
  PhatSinh DECIMAL(15,2) NOT NULL DEFAULT 0,
  SoTienThu DECIMAL(15,2) NOT NULL DEFAULT 0,
  NoCuoi DECIMAL(15,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (Thang, Nam, MaDaiLy),
  CONSTRAINT FK_BAOCAOCONGNO_MaDaiLy
    FOREIGN KEY (MaDaiLy) REFERENCES DAILY(MaDaiLy),
  CONSTRAINT CK_BAOCAOCONGNO_Thang CHECK (Thang BETWEEN 1 AND 12),
  CONSTRAINT CK_BAOCAOCONGNO_Nam CHECK (Nam >= 2000),
  CONSTRAINT CK_BAOCAOCONGNO_No CHECK (NoDau >= 0 AND PhatSinh >= 0 AND SoTienThu >= 0 AND NoCuoi >= 0)
) ENGINE=InnoDB;


-- ============================================================
-- TRIGGER 
-- ============================================================

DELIMITER $$
-- Kiểm tra ngày tiếp nhận không lớn hơn ngày hiện tại, số đại lý trong quận không vượt SoDaiLyToiDa, và tổng nợ không vượt mức nợ tối đa của loại đại lý.
CREATE TRIGGER trg_daily_bi
BEFORE INSERT ON DAILY
FOR EACH ROW
BEGIN
  IF NEW.NgayTiepNhan > CURDATE() THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ngày tiếp nhận đại lý không hợp lệ!';
  END IF;
END$$

CREATE TRIGGER trg_daily_bu
BEFORE UPDATE ON DAILY
FOR EACH ROW
BEGIN
  IF NEW.NgayTiepNhan > CURDATE() THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ngày tiếp nhận đại lý không hợp lệ!';
  END IF;
END$$

-- Nếu mặt hàng đã có trong phiếu nhập hoặc phiếu xuất thì không cho xóa.
CREATE TRIGGER trg_mathang_bd
BEFORE DELETE ON MATHANG
FOR EACH ROW
BEGIN
  IF EXISTS (SELECT 1 FROM CHITIET_PHIEUNHAP WHERE MaMatHang = OLD.MaMatHang)
     OR EXISTS (SELECT 1 FROM CHITIET_PHIEUXUAT WHERE MaMatHang = OLD.MaMatHang) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Không được xóa mặt hàng đã phát sinh nghiệp vụ!';
  END IF;
END$$

--  Nếu đại lý đã có phiếu xuất hoặc phiếu thu thì không cho xóa.
CREATE TRIGGER trg_daily_bd
BEFORE DELETE ON DAILY
FOR EACH ROW
BEGIN
  IF EXISTS (SELECT 1 FROM PHIEUXUATHANG WHERE MaDaiLy = OLD.MaDaiLy)
     OR EXISTS (SELECT 1 FROM PHIEUTHUTIEN WHERE MaDaiLy = OLD.MaDaiLy) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Không được xóa đại lý đã phát sinh nghiệp vụ!';
  END IF;
END$$

-- ===================================================================================================================
-- ===================================================================================================================

-- Kiểm tra ngày lập phiếu xuất phải sau hoặc bằng ngày tiếp nhận đại lý, và không được lớn hơn ngày hiện tại.
CREATE TRIGGER trg_pxh_bi
BEFORE INSERT ON PHIEUXUATHANG
FOR EACH ROW
BEGIN
  DECLARE v_ngay_tiep_nhan DATE;

  SELECT NgayTiepNhan INTO v_ngay_tiep_nhan FROM DAILY WHERE MaDaiLy = NEW.MaDaiLy;

  IF NEW.NgayLapPhieu < v_ngay_tiep_nhan THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ngày lập phiếu xuất phải sau ngày tiếp nhận đại lý!';
  END IF;

  IF NEW.NgayLapPhieu > CURDATE() THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ngày lập phiếu xuất không hợp lệ!';
  END IF;

END$$

-- Kiểm tra lại ngày lập phiếu xuất hợp lệ như lúc thêm.
CREATE TRIGGER trg_pxh_bu
BEFORE UPDATE ON PHIEUXUATHANG
FOR EACH ROW
BEGIN
  DECLARE v_ngay_tiep_nhan DATE;

  SELECT NgayTiepNhan INTO v_ngay_tiep_nhan FROM DAILY WHERE MaDaiLy = NEW.MaDaiLy;

  IF NEW.NgayLapPhieu < v_ngay_tiep_nhan THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ngày lập phiếu xuất phải sau ngày tiếp nhận đại lý!';
  END IF;

  IF NEW.NgayLapPhieu > CURDATE() THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ngày lập phiếu xuất không hợp lệ!';
  END IF;

END$$

-- Kiểm tra ngày thu tiền hợp lệ, đại lý đã có phiếu xuất trước ngày thu, và nếu bật quy định kiểm tra thì số tiền thu không được vượt tổng nợ.
CREATE TRIGGER trg_ptt_bi
BEFORE INSERT ON PHIEUTHUTIEN
FOR EACH ROW
BEGIN
  IF NEW.NgayThuTien > CURDATE() THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ngày thu tiền không hợp lệ!';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM PHIEUXUATHANG
    WHERE MaDaiLy = NEW.MaDaiLy AND NgayLapPhieu <= NEW.NgayThuTien
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Đại lý chưa có phiếu xuất trước ngày thu tiền!';
  END IF;
END$$

--  Kiểm tra lại ngày thu tiền, đại lý đã có phiếu xuất trước ngày thu, và số tiền thu mới không vượt tổng nợ hợp lệ.
CREATE TRIGGER trg_ptt_bu
BEFORE UPDATE ON PHIEUTHUTIEN
FOR EACH ROW
BEGIN

  IF NEW.NgayThuTien > CURDATE() THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ngày thu tiền không hợp lệ!';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM PHIEUXUATHANG
    WHERE MaDaiLy = NEW.MaDaiLy AND NgayLapPhieu <= NEW.NgayThuTien
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Đại lý chưa có phiếu xuất trước ngày thu tiền!';
  END IF;
END$$


-- ===================================================================================================================

-- ===================================================================================================================

-- Kiểm tra số lượng xuất không vượt tồn kho, sau đó tự tính đơn giá xuất theo công thức: DonGiaXuat = DonGiaHienTai * TiLeTinhDonGiaXuat.
CREATE TRIGGER trg_ctpx_bi
BEFORE INSERT ON CHITIET_PHIEUXUAT
FOR EACH ROW
BEGIN
  DECLARE v_ton_kho INT;
  SELECT TonKho INTO v_ton_kho
  FROM MATHANG WHERE MaMatHang = NEW.MaMatHang;

  IF NEW.SoLuongXuat > v_ton_kho THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Số lượng xuất vượt tồn kho!';
  END IF;
END$$

-- Kiểm tra số lượng xuất mới không vượt tồn kho hiện có cộng lại số lượng cũ.
CREATE TRIGGER trg_ctpx_bu
BEFORE UPDATE ON CHITIET_PHIEUXUAT
FOR EACH ROW
BEGIN
  DECLARE v_ton_kho INT;
  SELECT TonKho INTO v_ton_kho
  FROM MATHANG WHERE MaMatHang = NEW.MaMatHang;

  IF NEW.SoLuongXuat > v_ton_kho + OLD.SoLuongXuat THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Số lượng xuất vượt tồn kho!';
  END IF;
END$$

-- so luong ton kho
CREATE TRIGGER t13 
AFTER INSERT ON CHITIET_PHIEUNHAP
FOR EACH ROW
BEGIN
    UPDATE MATHANG
    SET TonKho = TonKho + NEW.SoLuongNhap,
        DonGiaHienTai = NEW.DonGiaNhap -- Gán đơn giá nhập mới nhất làm giá hiện tại
    WHERE MaMatHang = NEW.MaMatHang;
END$$

-- Giảm tồn kho
CREATE TRIGGER t14 
AFTER DELETE ON CHITIET_PHIEUNHAP
FOR EACH ROW
BEGIN
    UPDATE MATHANG
    SET TonKho = TonKho - OLD.SoLuongNhap
    WHERE MaMatHang = OLD.MaMatHang;
END$$

CREATE TRIGGER t15 
AFTER UPDATE ON CHITIET_PHIEUNHAP
FOR EACH ROW
BEGIN
    IF (OLD.MaMatHang <> NEW.MaMatHang) OR (OLD.SoLuongNhap <> NEW.SoLuongNhap) THEN
        UPDATE MATHANG
        SET TonKho = TonKho - OLD.SoLuongNhap
        WHERE MaMatHang = OLD.MaMatHang;

        UPDATE MATHANG
        SET TonKho = TonKho + NEW.SoLuongNhap,
            DonGiaHienTai = NEW.DonGiaNhap
        WHERE MaMatHang = NEW.MaMatHang;
    END IF;
END$$

CREATE TRIGGER t16 
AFTER INSERT ON CHITIET_PHIEUXUAT
FOR EACH ROW
BEGIN
    UPDATE MATHANG
    SET TonKho = TonKho - NEW.SoLuongXuat
    WHERE MaMatHang = NEW.MaMatHang;
END$$

CREATE TRIGGER t17 
AFTER DELETE ON CHITIET_PHIEUXUAT
FOR EACH ROW
BEGIN
    UPDATE MATHANG
    SET TonKho = TonKho + OLD.SoLuongXuat
    WHERE MaMatHang = OLD.MaMatHang;
END$$

CREATE TRIGGER t18 
AFTER UPDATE ON CHITIET_PHIEUXUAT
FOR EACH ROW
BEGIN
    IF (OLD.MaMatHang <> NEW.MaMatHang) OR (OLD.SoLuongXuat <> NEW.SoLuongXuat) THEN
        UPDATE MATHANG
        SET TonKho = TonKho + OLD.SoLuongXuat
        WHERE MaMatHang = OLD.MaMatHang;

        UPDATE MATHANG
        SET TonKho = TonKho - NEW.SoLuongXuat
        WHERE MaMatHang = NEW.MaMatHang;
    END IF;
END$$

DELIMITER ;