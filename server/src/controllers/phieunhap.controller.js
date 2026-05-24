const { sequelize, PhieuNhapHang, ChiTiet_PhieuNHap, MatHang, DonViTinh } = require('../models');

/**
 * GET /api/phieu-nhap
 * Lấy danh sách phiếu nhập
 */
const getAll = async (req, res) => {
  try {
    const phieuNhaps = await PhieuNhapHang.findAll({
      include: [
        {
          model: ChiTiet_PhieuNHap,
          as: 'chiTiets',
          include: [{ model: MatHang, as: 'matHang', include: [{ model: DonViTinh, as: 'dvt' }] }],
        },
      ],
      order: [['MaPhieuNhap', 'DESC']],
    });

    res.json({ status: 'success', data: phieuNhaps });
  } catch (error) {
    console.error('PhieuNhap getAll error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * GET /api/phieu-nhap/:id
 */
const getById = async (req, res) => {
  try {
    const phieu = await PhieuNhapHang.findByPk(req.params.id, {
      include: [
        {
          model: ChiTiet_PhieuNHap,
          as: 'chiTiets',
          include: [{ model: MatHang, as: 'matHang', include: [{ model: DonViTinh, as: 'dvt' }] }],
        },
      ],
    });

    if (!phieu) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy phiếu nhập.' });
    }

    res.json({ status: 'success', data: phieu });
  } catch (error) {
    console.error('PhieuNhap getById error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * POST /api/phieu-nhap
 * Lập phiếu nhập hàng (BM2)
 * Body: { NgayLapPhieu, chiTiets: [{ MaMatHang, SoLuong, DonGiaNhap }] }
 */
const create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { NgayLapPhieu, chiTiets } = req.body;

    if (!chiTiets || chiTiets.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Phiếu nhập phải có ít nhất 1 mặt hàng.',
      });
    }

    // Tính tổng tiền
    let tongTien = 0;
    const processedDetails = chiTiets.map((ct) => {
      const thanhTien = ct.SoLuongNhap * ct.DonGiaNhap;
      tongTien += thanhTien;
      return { ...ct, ThanhTien: thanhTien };
    });

    // Tạo phiếu nhập
    const phieu = await PhieuNhapHang.create(
      { NgayLapPhieu: NgayLapPhieu || new Date(), TongTien: tongTien },
      { transaction: t }
    );

    // Tạo chi tiết + cập nhật tồn kho (QĐ6)
    for (const ct of processedDetails) {
      await ChiTiet_PhieuNHap.create(
        { MaPhieuNhap: phieu.MaPhieuNhap, ...ct },
        { transaction: t }
      );

      // QĐ6: Cập nhật số lượng tồn kho
      await MatHang.increment('SoLuongTon', {
        by: ct.SoLuongNhap,
        where: { MaMatHang: ct.MaMatHang },
        transaction: t,
      });
    }

    await t.commit();

    // Trả về phiếu đầy đủ
    const result = await PhieuNhapHang.findByPk(phieu.MaPhieuNhap, {
      include: [
        {
          model: ChiTiet_PhieuNHap,
          as: 'chiTiets',
          include: [{ model: MatHang, as: 'matHang', include: [{ model: DonViTinh, as: 'dvt' }] }],
        },
      ],
    });

    res.status(201).json({
      status: 'success',
      message: 'Lập phiếu nhập thành công.',
      data: result,
    });
  } catch (error) {
    await t.rollback();
    console.error('PhieuNhap create error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getAll, getById, create };
