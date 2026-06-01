const { sequelize, PhieuNhapHang, ChiTiet_PhieuNhap, MatHang, DonViTinh } = require('../models');

/**
 * GET /api/phieu-nhap
 * Lấy danh sách phiếu nhập
 */
const getAll = async (req, res) => {
  try {
    const phieuNhaps = await PhieuNhapHang.findAll({
      include: [
        {
          model: ChiTiet_PhieuNhap,
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
          model: ChiTiet_PhieuNhap,
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
      tongTien += ct.SoLuongNhap * ct.DonGiaNhap;
      return {
        MaMatHang: ct.MaMatHang,
        SoLuongNhap: ct.SoLuongNhap,
        DonGiaNhap: ct.DonGiaNhap
        // ThanhTien is a GENERATED ALWAYS AS column — MySQL computes it automatically
      };
    });

    // Tạo phiếu nhập
    const phieu = await PhieuNhapHang.create(
      { NgayLapPhieu: NgayLapPhieu || new Date(), TongTien: tongTien },
      { transaction: t }
    );

    // Tạo chi tiết + cập nhật tồn kho (QĐ6)
    for (const ct of processedDetails) {
      await ChiTiet_PhieuNhap.create(
        { MaPhieuNhap: phieu.MaPhieuNhap, ...ct },
        { transaction: t }
      );

      // QĐ6: Cập nhật số lượng tồn kho + Cập nhật đơn giá hiện tại
      await MatHang.update(
        {
          TonKho: sequelize.literal(`TonKho + ${ct.SoLuongNhap}`),
          DonGiaHienTai: ct.DonGiaNhap
        },
        {
          where: { MaMatHang: ct.MaMatHang },
          transaction: t
        }
      );
    }


    await t.commit();

    // Trả về phiếu đầy đủ
    const result = await PhieuNhapHang.findByPk(phieu.MaPhieuNhap, {
      include: [
        {
          model: ChiTiet_PhieuNhap,
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

/**
 * DELETE /api/phieu-nhap/:id
 * Xóa phiếu nhập + hoàn tác tồn kho
 */
const remove = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const phieu = await PhieuNhapHang.findByPk(req.params.id, { transaction: t });
    if (!phieu) {
      await t.rollback();
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy phiếu nhập.' });
    }

    // Hoàn tác tồn kho: giảm lại số lượng đã nhập
    const chiTiets = await ChiTiet_PhieuNhap.findAll({ where: { MaPhieuNhap: phieu.MaPhieuNhap }, transaction: t });
    for (const ct of chiTiets) {
      await MatHang.decrement('TonKho', {
        by: ct.SoLuongNhap,
        where: { MaMatHang: ct.MaMatHang },
        transaction: t,
      });
    }

    // Xóa chi tiết rồi xóa phiếu
    await ChiTiet_PhieuNhap.destroy({ where: { MaPhieuNhap: phieu.MaPhieuNhap }, transaction: t });
    await phieu.destroy({ transaction: t });

    await t.commit();
    res.json({ status: 'success', message: 'Xóa phiếu nhập thành công.' });
  } catch (error) {
    await t.rollback();
    console.error('PhieuNhap delete error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getAll, getById, create, remove };
