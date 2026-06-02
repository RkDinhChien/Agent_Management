const { sequelize, PhieuThuTien, DaiLy, LoaiDaiLy, ThamSo } = require('../models');

/**
 * GET /api/phieu-thu
 */
const getAll = async (req, res) => {
  try {
    const phieuThus = await PhieuThuTien.findAll({
      include: [{ model: DaiLy, as: 'daiLy' }],
      order: [['MaPhieuThu', 'DESC']],
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
    const { MaDaiLy, NgayThuTien } = req.body;
    let SoTienThu = req.body.SoTienThu;
    SoTienThu = parseFloat(SoTienThu);

    const daiLy = await DaiLy.findByPk(MaDaiLy, { transaction: t });
    if (!daiLy) {
      await t.rollback();
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy đại lý.' });
    }

    // QĐ4: Kiểm tra số tiền thu <= tiền nợ
    const thamSo = await ThamSo.findOne();
    const kiemTra = typeof thamSo?.ApDungQDKiemTraSoTienThu !== 'undefined'
      ? Boolean(thamSo.ApDungQDKiemTraSoTienThu)
      : true;

    const tongNo = parseFloat(daiLy.TongNo) || 0;

    if (kiemTra && SoTienThu > tongNo) {
      await t.rollback();
      return res.status(400).json({
        status: 'error',
        message: `Số tiền thu (${SoTienThu.toLocaleString()}đ) không được vượt quá tiền nợ (${tongNo.toLocaleString()}đ).`,
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
      { MaDaiLy, NgayThuTien: NgayThuTien || new Date(), SoTienThu },
      { transaction: t }
    );

    // QĐ7: Cập nhật tiền nợ
    const decreaseBy = Math.min(SoTienThu, tongNo);
    if (decreaseBy > 0) {
      await DaiLy.decrement('TongNo', {
        by: decreaseBy,
        where: { MaDaiLy },
        transaction: t,
      });
    }

    await t.commit();

    const result = await PhieuThuTien.findByPk(phieu.MaPhieuThu, {
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

/**
 * DELETE /api/phieu-thu/:id
 * Xóa phiếu thu + hoàn tác tiền nợ (tăng lại TongNo)
 */
const remove = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const phieu = await PhieuThuTien.findByPk(req.params.id, { transaction: t });
    if (!phieu) {
      await t.rollback();
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy phiếu thu.' });
    }

    // Hoàn tác: tăng lại tiền nợ
    await DaiLy.increment('TongNo', {
      by: parseFloat(phieu.SoTienThu) || 0,
      where: { MaDaiLy: phieu.MaDaiLy },
      transaction: t,
    });

    await phieu.destroy({ transaction: t });

    await t.commit();
    res.json({ status: 'success', message: 'Xóa phiếu thu thành công.' });
  } catch (error) {
    await t.rollback();
    console.error('PhieuThu delete error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * PUT /api/phieu-thu/:id
 */
const update = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { NgayThuTien, SoTienThu } = req.body;
    const phieu = await PhieuThuTien.findByPk(req.params.id, { transaction: t });
    if (!phieu) {
      await t.rollback();
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy phiếu thu.' });
    }

    const daiLy = await DaiLy.findByPk(phieu.MaDaiLy, { transaction: t });
    if (!daiLy) {
      await t.rollback();
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy đại lý.' });
    }

    const oldAmount = parseFloat(phieu.SoTienThu) || 0;
    const newAmount = parseFloat(SoTienThu) || 0;
    const diff = newAmount - oldAmount;
    const currentDebt = parseFloat(daiLy.TongNo) || 0;

    if (newAmount <= 0) {
      await t.rollback();
      return res.status(400).json({ status: 'error', message: 'Số tiền thu phải lớn hơn 0.' });
    }

    // Cập nhật TongNo: hoàn lại cũ rồi trừ mới, nhưng không để số nợ âm
    if (diff > 0) {
      if (diff > currentDebt) {
        await t.rollback();
        return res.status(400).json({ status: 'error', message: 'Số tiền thu mới không được vượt quá số nợ hiện tại.', rule: 'QD4' });
      }
      await DaiLy.decrement('TongNo', {
        by: diff,
        where: { MaDaiLy: phieu.MaDaiLy },
        transaction: t,
      });
    } else if (diff < 0) {
      await DaiLy.increment('TongNo', {
        by: -diff,
        where: { MaDaiLy: phieu.MaDaiLy },
        transaction: t,
      });
    }

    await phieu.update(
      { NgayThuTien: NgayThuTien || phieu.NgayThuTien, SoTienThu: newAmount },
      { transaction: t }
    );

    await t.commit();
    const result = await PhieuThuTien.findByPk(phieu.MaPhieuThu, {
      include: [{ model: DaiLy, as: 'daiLy' }],
    });
    res.json({ status: 'success', message: 'Cập nhật phiếu thu thành công.', data: result });
  } catch (error) {
    await t.rollback();
    console.error('PhieuThu update error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getAll, create, update, remove };
