const { Op } = require('sequelize');
const { DaiLy, LoaiDaiLy, Quan, PhieuXuatHang, MatHang } = require('../models');

/**
 * GET /api/dashboard
 * Dữ liệu tổng hợp cho Dashboard
 */
const getDashboard = async (req, res) => {
  try {
    // Tổng số đại lý
    const tongDaiLy = await DaiLy.count();

    // Tổng doanh số (tổng TongTien tất cả phiếu xuất)
    const tongDoanhSo = await PhieuXuatHang.sum('TongTien') || 0;

    // Tổng nợ
    const tongNo = await DaiLy.sum('TienNo') || 0;

    // Tổng mặt hàng
    const tongMatHang = await MatHang.count();

    // Top 5 đại lý nợ nhiều nhất
    const topDebtors = await DaiLy.findAll({
      where: { TienNo: { [Op.gt]: 0 } },
      include: [
        { model: LoaiDaiLy, as: 'loaiDaiLy' },
        { model: Quan, as: 'quan' },
      ],
      order: [['TienNo', 'DESC']],
      limit: 5,
    });

    // Doanh số 6 tháng gần nhất
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const doanhSoTheoThang = [];

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const doanhSo = await PhieuXuatHang.sum('TongTien', {
        where: {
          NgayXuat: { [Op.between]: [month, endMonth] },
        },
      }) || 0;

      doanhSoTheoThang.push({
        thang: month.getMonth() + 1,
        nam: month.getFullYear(),
        label: `T${month.getMonth() + 1}/${month.getFullYear()}`,
        doanhSo,
      });
    }

    res.json({
      status: 'success',
      data: {
        tongDaiLy,
        tongDoanhSo,
        tongNo,
        tongMatHang,
        topDebtors,
        doanhSoTheoThang,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getDashboard };
