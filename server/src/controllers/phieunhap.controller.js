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
 * Body: { NgayLapPhieu, chiTiets: [{ MaMatHang, SoLuongNhap, DonGiaNhap }] }
 */
const create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { NgayLapPhieu, chiTiets } = req.body;
    console.log('PhieuNhap create body:', JSON.stringify(req.body));
    console.log('Controller file path:', __filename);

    if (!chiTiets || !Array.isArray(chiTiets) || chiTiets.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Phiếu nhập phải có ít nhất 1 mặt hàng.',
      });
    }

    // Tính tổng tiền và chuẩn hóa dữ liệu
    let tongTien = 0;
    const processedDetails = chiTiets.map((ct, idx) => {
      const sl = Number(ct.SoLuongNhap) || 0;
      const dg = Number(ct.DonGiaNhap) || 0;
      let thanhTien = sl * dg;
      if (!Number.isFinite(thanhTien)) thanhTien = 0;
      tongTien += thanhTien;
      return {
        MaMatHang: ct.MaMatHang,
        SoLuongNhap: sl,
        DonGiaNhap: dg,
        ThanhTien: thanhTien,
        _index: idx,
      };
    });

    console.log('Processed chiTiets count:', processedDetails.length);

    // Tạo phiếu nhập
    const phieu = await PhieuNhapHang.create(
      { NgayLapPhieu: NgayLapPhieu ? new Date(NgayLapPhieu) : new Date(), TongTien: tongTien },
      { transaction: t }
    );

    // Chèn chi tiết bằng raw SQL (tránh mapping/validation khác)
    for (const ct of processedDetails) {
      console.log('Insert detail idx=', ct._index, 'MaMatHang=', ct.MaMatHang, 'SoLuong=', ct.SoLuongNhap, 'DonGia=', ct.DonGiaNhap, 'ThanhTien=', ct.ThanhTien, 'types=', typeof ct.SoLuongNhap, typeof ct.DonGiaNhap, typeof ct.ThanhTien);

            // ThanhTien is a GENERATED column in MySQL; omit it from INSERT so DB computes it
      const sql = 'INSERT INTO CHITIET_PHIEUNHAP (MaPhieuNhap, MaMatHang, SoLuongNhap, DonGiaNhap) VALUES (?, ?, ?, ?)';
      await sequelize.query(sql, {
        replacements: [phieu.MaPhieuNhap, ct.MaMatHang, ct.SoLuongNhap, ct.DonGiaNhap],
        transaction: t,
      });

      // Cập nhật tồn kho
      await MatHang.increment('TonKho', {
        by: ct.SoLuongNhap,
        where: { MaMatHang: ct.MaMatHang },
        transaction: t,
      });
    }

    await t.commit();

    const result = await PhieuNhapHang.findByPk(phieu.MaPhieuNhap, {
      include: [
        {
          model: ChiTiet_PhieuNhap,
          as: 'chiTiets',
          include: [{ model: MatHang, as: 'matHang', include: [{ model: DonViTinh, as: 'dvt' }] }],
        },
      ],
    });

    res.status(201).json({ status: 'success', message: 'Lập phiếu nhập thành công.', data: result });
  } catch (error) {
    await t.rollback();
    console.error('PhieuNhap create error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * PUT /api/phieu-nhap/:id
 * Cập nhật phiếu nhập: xóa chi tiết cũ, hoàn tồn kho, rồi thêm chi tiết mới
 */
const update = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { NgayLapPhieu, chiTiets } = req.body;
    const phieu = await PhieuNhapHang.findByPk(req.params.id, {
      include: [{ model: ChiTiet_PhieuNhap, as: 'chiTiets' }],
      transaction: t,
    });
    if (!phieu) {
      await t.rollback();
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy phiếu nhập.' });
    }

    // Hoàn tồn kho từ chi tiết cũ
    for (const ct of phieu.chiTiets) {
      await MatHang.decrement('TonKho', { by: ct.SoLuongNhap, where: { MaMatHang: ct.MaMatHang }, transaction: t });
    }
    await ChiTiet_PhieuNhap.destroy({ where: { MaPhieuNhap: phieu.MaPhieuNhap }, transaction: t });

    // Thêm chi tiết mới
    let tongTien = 0;
    for (const ct of chiTiets) {
      const sl = Number(ct.SoLuongNhap) || 0;
      const dg = Number(ct.DonGiaNhap) || 0;
      tongTien += sl * dg;
      await sequelize.query(
        'INSERT INTO CHITIET_PHIEUNHAP (MaPhieuNhap, MaMatHang, SoLuongNhap, DonGiaNhap) VALUES (?,?,?,?)',
        { replacements: [phieu.MaPhieuNhap, ct.MaMatHang, sl, dg], transaction: t }
      );
      await MatHang.increment('TonKho', { by: sl, where: { MaMatHang: ct.MaMatHang }, transaction: t });
    }

    await phieu.update({ NgayLapPhieu: NgayLapPhieu || phieu.NgayLapPhieu, TongTien: tongTien }, { transaction: t });
    await t.commit();

    const result = await PhieuNhapHang.findByPk(phieu.MaPhieuNhap, {
      include: [{ model: ChiTiet_PhieuNhap, as: 'chiTiets', include: [{ model: MatHang, as: 'matHang', include: [{ model: DonViTinh, as: 'dvt' }] }] }],
    });
    res.json({ status: 'success', message: 'Cập nhật phiếu nhập thành công.', data: result });
  } catch (error) {
    await t.rollback();
    console.error('PhieuNhap update error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

const remove = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const phieu = await PhieuNhapHang.findByPk(req.params.id, {
      include: [{ model: ChiTiet_PhieuNhap, as: 'chiTiets' }],
      transaction: t,
    });

    if (!phieu) {
      await t.rollback();
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy phiếu nhập.' });
    }

    for (const ct of phieu.chiTiets || []) {
      await MatHang.decrement('TonKho', {
        by: ct.SoLuongNhap,
        where: { MaMatHang: ct.MaMatHang },
        transaction: t,
      });
    }

    await ChiTiet_PhieuNhap.destroy({ where: { MaPhieuNhap: phieu.MaPhieuNhap }, transaction: t });
    await phieu.destroy({ transaction: t });

    await t.commit();
    res.json({ status: 'success', message: 'Xóa phiếu nhập thành công.' });
  } catch (error) {
    await t.rollback();
    console.error('PhieuNhap remove error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getAll, getById, create, update, remove };

