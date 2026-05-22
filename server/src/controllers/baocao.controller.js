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

    const existingReport = await BaoCaoDoanhSo.findOne({
      where: { Thang: month, Nam: year },
      include: [
        {
          model: ChiTiet_BaoCaoDoanhSo,
          as: 'chiTietBaoCaoDoanhSos',
          include: [
            {
              model: DaiLy,
              as: 'daiLy',
              include: [
                { model: LoaiDaiLy, as: 'loaiDaiLy' },
                { model: Quan, as: 'quan' },
              ],
            },
          ],
        },
      ],
    });

    if (existingReport) {
      const chiTiet = existingReport.chiTietBaoCaoDoanhSos.map((item) => ({
        MaDaiLy: item.MaDaiLy,
        TenDaiLy: item.daiLy?.TenDaiLy,
        LoaiDaiLy: item.daiLy?.loaiDaiLy?.TenLoai,
        Quan: item.daiLy?.quan?.TenQuan,
        SoPhieuXuat: item.SoLuongPhieuXuat,
        TongTriGia: parseFloat(item.TongTriGia) || 0,
        TiLe: parseFloat(item.TiLe) || 0,
      }));

      return res.json({
        status: 'success',
        data: {
          Thang: month,
          Nam: year,
          TongDoanhSo: parseFloat(existingReport.TongDoanhSo) || 0,
          chiTiet,
        },
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

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
        SoPhieuXuat: soPhieuXuat,
        TongTriGia: tongTriGia,
        TiLe: 0,
      };
    });

    baoCaoData.forEach((item) => {
      item.TiLe = tongDoanhSo > 0 ? Math.round((item.TongTriGia / tongDoanhSo) * 10000) / 100 : 0;
    });

    const filtered = baoCaoData.filter((item) => item.SoPhieuXuat > 0);

    const summary = await BaoCaoDoanhSo.create({
      Thang: month,
      Nam: year,
      TongDoanhSo: tongDoanhSo,
    });

    const detailPayload = filtered.map((item) => ({
      MaBCDS: summary.MaBCDS,
      MaDaiLy: item.MaDaiLy,
      SoLuongPhieuXuat: item.SoPhieuXuat,
      TongTriGia: item.TongTriGia,
      TiLe: item.TiLe,
    }));

    if (detailPayload.length > 0) {
      await ChiTiet_BaoCaoDoanhSo.bulkCreate(detailPayload);
    }

    res.json({
      status: 'success',
      data: {
        Thang: month,
        Nam: year,
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
          where: { NgayLapPhieu: { [Op.between]: [startDate, endDate] } },
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
