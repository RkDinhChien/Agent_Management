const { Op, fn, col } = require('sequelize');
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
    const tongNo = await DaiLy.sum('TongNo') || 0;

    // Tổng mặt hàng
    const tongMatHang = await MatHang.count();

    // Phân bố loại đại lý
    const typeCounts = await LoaiDaiLy.findAll({
      attributes: [
        ['MaLoaiDaiLy', 'maLoai'],
        ['TenLoaiDaiLy', 'tenLoai'],
        [fn('COUNT', col('daiLys.MaDaiLy')), 'count'],
      ],
      include: [
        {
          model: DaiLy,
          as: 'daiLys',
          attributes: [],
        },
      ],
      group: ['LoaiDaiLy.MaLoaiDaiLy', 'LoaiDaiLy.TenLoaiDaiLy'],
      raw: true,
    });

    const typeDistribution = typeCounts.map((item) => ({
      maLoai: item.maLoai,
      tenLoai: item.tenLoai || 'Chưa rõ',
      count: Number(item.count || 0),
    }));

    // Cảnh báo nợ đại lý
    const allAgents = await DaiLy.findAll({
      include: [
        {
          model: LoaiDaiLy,
          as: 'loaiDaiLy',
          attributes: ['TienNoToiDa', 'TenLoaiDaiLy'],
        },
        {
          model: Quan,
          as: 'quan',
          attributes: ['TenQuan'],
        },
      ],
    });

    const debtOffenders = allAgents
      .map((agent) => {
        const hanMuc = Number(agent.loaiDaiLy?.TienNoToiDa || 0);
        const tongNoAgent = Number(agent.TongNo || 0);
        return {
          MaDaiLy: agent.MaDaiLy,
          TenDaiLy: agent.TenDaiLy,
          TongNo: tongNoAgent,
          hanMuc,
          overLimit: Math.max(0, tongNoAgent - hanMuc),
          loaiDaiLy: agent.loaiDaiLy,
          quan: agent.quan,
        };
      })
      .filter((item) => item.overLimit > 0)
      .sort((a, b) => b.overLimit - a.overLimit)
      .slice(0, 5);

    const topAgents = [...allAgents]
      .map((agent) => ({
        MaDaiLy: agent.MaDaiLy,
        TenDaiLy: agent.TenDaiLy,
        TongNo: Number(agent.TongNo || 0),
        hanMuc: Number(agent.loaiDaiLy?.TienNoToiDa || 0),
        loaiDaiLy: agent.loaiDaiLy,
        quan: agent.quan,
      }))
      .sort((a, b) => b.TongNo - a.TongNo)
      .slice(0, 3);

    // Doanh số 6 tháng gần nhất
    const now = new Date();
    const doanhSoTheoThang = [];

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const doanhSo = await PhieuXuatHang.sum('TongTien', {
        where: {
          NgayLapPhieu: { [Op.between]: [month, endMonth] },
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
        typeDistribution,
        debtOffenders,
        topAgents,
        doanhSoTheoThang,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getDashboard };
