const { sequelize, PhieuThuTien, DaiLy, LoaiDaiLy, ThamSo } = require('../models');

/**
 * GET /api/phieu-thu
 */
const getAll = async (req, res) => {
  try {
    const phieuThus = await PhieuThuTien.findAll({
      include: [{ model: DaiLy, as: 'daiLy' }],
      order: [['MaPT', 'DESC']],
    });

    res.json({ status: 'success', data: phieuThus });
  } catch (error) {
    console.error('PhieuThu getAll error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * POST /api/phieu-thu
 * Lập phiếu thu tiền (BM5)
 * Body: { MaDaiLy, NgayThu, SoTienThu }
 *
 * QĐ4: SoTienThu <= TienNo
 * QĐ7: Cập nhật TienNo
 */
const create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { MaDaiLy, NgayThu, SoTienThu } = req.body;

    const daiLy = await DaiLy.findByPk(MaDaiLy, { transaction: t });
    if (!daiLy) {
      await t.rollback();
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy đại lý.' });
    }

    // QĐ4: Kiểm tra số tiền thu <= tiền nợ
    const kiemTraThamSo = await ThamSo.findOne({ where: { TenThamSo: 'KiemTraSoTienThu' } });
    const kiemTra = kiemTraThamSo ? kiemTraThamSo.GiaTri === '1' : true;

    const tienNo = parseFloat(daiLy.TienNo) || 0;

    if (kiemTra && SoTienThu > tienNo) {
      await t.rollback();
      return res.status(400).json({
        status: 'error',
        message: `Số tiền thu (${SoTienThu.toLocaleString()}đ) không được vượt quá tiền nợ (${tienNo.toLocaleString()}đ).`,
        rule: 'QD4',
      });
    }

    if (SoTienThu <= 0) {
      await t.rollback();
      return res.status(400).json({
        status: 'error',
        message: 'Số tiền thu phải lớn hơn 0.',
      });
    }

    // Tạo phiếu thu
    const phieu = await PhieuThuTien.create(
      { MaDaiLy, NgayThu: NgayThu || new Date(), SoTienThu },
      { transaction: t }
    );

    // QĐ7: Cập nhật tiền nợ
    await DaiLy.decrement('TienNo', {
      by: SoTienThu,
      where: { MaDaiLy },
      transaction: t,
    });

    await t.commit();

    const result = await PhieuThuTien.findByPk(phieu.MaPT, {
      include: [{ model: DaiLy, as: 'daiLy' }],
    });

    res.status(201).json({
      status: 'success',
      message: 'Lập phiếu thu tiền thành công.',
      data: result,
    });
  } catch (error) {
    await t.rollback();
    console.error('PhieuThu create error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getAll, create };
