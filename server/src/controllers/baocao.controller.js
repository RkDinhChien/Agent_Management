const { Op } = require('sequelize');
const {
  sequelize,
  BaoCaoDoanhSo,
  ChiTiet_BaoCaoDoanhSo,
  BaoCaoCongNo,
  DaiLy,
  PhieuXuatHang,
  ChiTiet_PhieuXuat,
  PhieuThuTien,
  LoaiDaiLy,
  Quan,
} = require('../models');

/**
 * GET /api/bao-cao/doanh-so?thang=X&nam=Y
 * Báo cáo doanh số tháng (BM6.1)
 */
const getDoanhSo = async (req, res) => {
  try {
    const { thang, nam } = req.query;

    if (!thang || !nam) {
      return res.status(400).json({
        status: 'error',
        message: 'Vui lòng chọn tháng và năm.',
      });
    }

    const month = parseInt(thang, 10);
    const year = parseInt(nam, 10);
    if (Number.isNaN(month) || Number.isNaN(year)) {
      return res.status(400).json({
        status: 'error',
        message: 'Tháng hoặc năm không hợp lệ.',
      });
    }

    const startDate = new Date(year, month - 1, 1, 0, 0, 0);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const daiLys = await DaiLy.findAll({
      include: [
        { model: LoaiDaiLy, as: 'loaiDaiLy' },
        { model: Quan, as: 'quan' },
        {
          model: PhieuXuatHang,
          as: 'phieuXuats',
          where: {
            NgayLapPhieu: { [Op.between]: [startDate, endDate] },
          },
          required: false,
        },
      ],
    });

    let tongDoanhSo = 0;
    const baoCaoData = daiLys.map((dl) => {
      const soPhieuXuat = dl.phieuXuats ? dl.phieuXuats.length : 0;
      const tongTriGia = dl.phieuXuats
        ? dl.phieuXuats.reduce((sum, px) => sum + parseFloat(px.TongTien || 0), 0)
        : 0;
      tongDoanhSo += tongTriGia;

      return {
        MaDaiLy: dl.MaDaiLy,
        TenDaiLy: dl.TenDaiLy,
        LoaiDaiLy: dl.loaiDaiLy?.TenLoai,
        Quan: dl.quan?.TenQuan,
        SoLuongPhieuXuat: soPhieuXuat,
        TongTriGia: tongTriGia,
        TiLe: 0,
      };
    });

    baoCaoData.forEach((item) => {
      item.TiLe = tongDoanhSo > 0 ? Math.round((item.TongTriGia / tongDoanhSo) * 10000) / 100 : 0;
    });

    // Trả về toàn bộ danh sách, không lọc để giao diện không bị trống
    const resultData = baoCaoData;

    return res.json({
      status: 'success',
      data: {
        Thang: month,
        Nam: year,
        TongDoanhSo: tongDoanhSo,
        chiTiet: resultData,
      },
    });
  } catch (error) {
    console.error('BaoCao doanhSo error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

const getCongNo = async (req, res) => {
  try {
    const { thang, nam } = req.query;

    if (!thang || !nam) {
      return res.status(400).json({
        status: 'error',
        message: 'Vui lòng chọn tháng và năm.',
      });
    }

    const month = parseInt(thang, 10);
    const year = parseInt(nam, 10);
    if (Number.isNaN(month) || Number.isNaN(year)) {
      return res.status(400).json({ status: 'error', message: 'Tháng hoặc năm không hợp lệ.' });
    }

    const startDate = new Date(year, month - 1, 1, 0, 0, 0);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Load all agents with:
    //  - phieuXuatsTrongKy: exports WITHIN this month (for PhatSinh)
    //  - phieuThusTrongKy:  collections WITHIN this month (for DaThu)
    //  - phieuXuatsTatCa:   ALL exports up to end of period (for NoCuoi)
    //  - phieuThusTatCa:    ALL collections up to end of period (for NoCuoi)
    const daiLys = await DaiLy.findAll({
      include: [
        { model: LoaiDaiLy, as: 'loaiDaiLy' },
        { model: Quan, as: 'quan' },
        {
          model: PhieuXuatHang,
          as: 'phieuXuats',
          required: false,
          // Load ALL, we'll filter in JS
        },
        {
          model: PhieuThuTien,
          as: 'phieuThus',
          required: false,
          // Load ALL, we'll filter in JS
        },
      ],
    });

    const baoCaoData = daiLys.map((dl) => {
      const allXuats = dl.phieuXuats || [];
      const allThus  = dl.phieuThus  || [];

      // Phát sinh trong kỳ (phiếu xuất in this month)
      const tongXuat = allXuats
        .filter(px => {
          const d = new Date(px.NgayLapPhieu);
          return d >= startDate && d <= endDate;
        })
        .reduce((sum, px) => {
          const tongTien = parseFloat(px.TongTien || 0);
          const tienTra = parseFloat(px.TienTra || 0);
          const conLai = Number.isFinite(parseFloat(px.ConLai))
            ? Math.max(0, parseFloat(px.ConLai))
            : Math.max(0, tongTien - tienTra);
          return sum + conLai;
        }, 0);

      // Đã thu trong kỳ (phiếu thu in this month)
      const tongThu = allThus
        .filter(pt => {
          const d = new Date(pt.NgayThuTien);
          return d >= startDate && d <= endDate;
        })
        .reduce((sum, pt) => sum + parseFloat(pt.SoTienThu || 0), 0);

      // Nợ cuối kỳ: tổng tất cả xuất - tổng tất cả thu, tính đến hết ngày endDate
      const totalXuatToDate = allXuats
        .filter(px => new Date(px.NgayLapPhieu) <= endDate)
        .reduce((sum, px) => {
          const tongTien = parseFloat(px.TongTien || 0);
          const tienTra = parseFloat(px.TienTra || 0);
          const conLai = Number.isFinite(parseFloat(px.ConLai))
            ? Math.max(0, parseFloat(px.ConLai))
            : Math.max(0, tongTien - tienTra);
          return sum + conLai;
        }, 0);

      const totalThuToDate = allThus
        .filter(pt => new Date(pt.NgayThuTien) <= endDate)
        .reduce((sum, pt) => sum + parseFloat(pt.SoTienThu || 0), 0);

      const noCuoi = Math.max(0, totalXuatToDate - totalThuToDate);

      // Nợ cuối tháng trước = Nợ đầu kỳ
      const noDau = Math.max(0, noCuoi - tongXuat + tongThu);

      return {
        MaDaiLy: dl.MaDaiLy,
        TenDaiLy: dl.TenDaiLy,
        LoaiDaiLy: dl.loaiDaiLy?.TenLoai,
        Quan: dl.quan?.TenQuan,
        NoDau: Math.round(noDau),
        PhatSinh: Math.round(tongXuat),
        DaThu: Math.round(tongThu),
        NoCuoi: Math.round(noCuoi),
        HanMuc: parseFloat(dl.loaiDaiLy?.TienNoToiDa) || 0,
      };
    });

    res.json({
      status: 'success',
      data: {
        Thang: month,
        Nam: year,
        chiTiet: baoCaoData,
      },
    });
  } catch (error) {
    console.error('BaoCao congNo error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};


module.exports = { getDoanhSo, getCongNo };
