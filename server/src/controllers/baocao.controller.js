const { Op } = require('sequelize');
const {
  sequelize,
  BaoCaoDoanhSo,
  BaoCaoCongNo,
  DaiLy,
  PhieuXuatHang,
  CT_PXH,
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

    // Tính doanh số từ phiếu xuất
    const startDate = new Date(nam, thang - 1, 1);
    const endDate = new Date(nam, thang, 0);

    const daiLys = await DaiLy.findAll({
      include: [
        { model: LoaiDaiLy, as: 'loaiDaiLy' },
        { model: Quan, as: 'quan' },
        {
          model: PhieuXuatHang,
          as: 'phieuXuats',
          where: {
            NgayXuat: { [Op.between]: [startDate, endDate] },
          },
          required: false,
        },
      ],
    });

    // Tính tổng doanh số tất cả đại lý
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
        SoPhieuXuat: soPhieuXuat,
        TongTriGia: tongTriGia,
        TyLe: 0, // Sẽ tính sau
      };
    });

    // Tính tỷ lệ
    baoCaoData.forEach((item) => {
      item.TyLe = tongDoanhSo > 0 ? Math.round((item.TongTriGia / tongDoanhSo) * 10000) / 100 : 0;
    });

    // Lọc chỉ đại lý có phiếu xuất
    const filtered = baoCaoData.filter((item) => item.SoPhieuXuat > 0);

    res.json({
      status: 'success',
      data: {
        Thang: parseInt(thang),
        Nam: parseInt(nam),
        TongDoanhSo: tongDoanhSo,
        chiTiet: filtered,
      },
    });
  } catch (error) {
    console.error('BaoCao doanhSo error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * GET /api/bao-cao/cong-no?thang=X&nam=Y
 * Báo cáo công nợ tháng (BM6.2)
 */
const getCongNo = async (req, res) => {
  try {
    const { thang, nam } = req.query;

    if (!thang || !nam) {
      return res.status(400).json({
        status: 'error',
        message: 'Vui lòng chọn tháng và năm.',
      });
    }

    const startDate = new Date(nam, thang - 1, 1);
    const endDate = new Date(nam, thang, 0);

    const daiLys = await DaiLy.findAll({
      include: [
        { model: LoaiDaiLy, as: 'loaiDaiLy' },
        { model: Quan, as: 'quan' },
        {
          model: PhieuXuatHang,
          as: 'phieuXuats',
          where: { NgayXuat: { [Op.between]: [startDate, endDate] } },
          required: false,
        },
        {
          model: PhieuThuTien,
          as: 'phieuThus',
          where: { NgayThu: { [Op.between]: [startDate, endDate] } },
          required: false,
        },
      ],
    });

    const baoCaoData = daiLys.map((dl) => {
      // Phát sinh = tổng xuất - tổng thu
      const tongXuat = dl.phieuXuats
        ? dl.phieuXuats.reduce((sum, px) => sum + parseFloat(px.TongTien || 0), 0)
        : 0;
      const tongThu = dl.phieuThus
        ? dl.phieuThus.reduce((sum, pt) => sum + parseFloat(pt.SoTienThu || 0), 0)
        : 0;
      const phatSinh = tongXuat - tongThu;

      // Nợ cuối = Nợ hiện tại (đã được cập nhật real-time)
      const noCuoi = parseFloat(dl.TienNo) || 0;
      const noDau = noCuoi - phatSinh;

      return {
        MaDaiLy: dl.MaDaiLy,
        TenDaiLy: dl.TenDaiLy,
        LoaiDaiLy: dl.loaiDaiLy?.TenLoai,
        Quan: dl.quan?.TenQuan,
        NoDau: Math.max(0, noDau),
        PhatSinh: phatSinh,
        NoCuoi: noCuoi,
      };
    });

    res.json({
      status: 'success',
      data: {
        Thang: parseInt(thang),
        Nam: parseInt(nam),
        chiTiet: baoCaoData,
      },
    });
  } catch (error) {
    console.error('BaoCao congNo error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getDoanhSo, getCongNo };
