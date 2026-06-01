const { QueryTypes } = require('sequelize');
const {
  sequelize,
  PhieuXuatHang,
  ChiTiet_PhieuXuat,
  DaiLy,
  LoaiDaiLy,
  MatHang,
  DonViTinh,
  ThamSo,
  ChiTiet_PhieuNhap,
} = require('../models');

/**
 * GET /api/phieu-xuat
 */
const getAll = async (req, res) => {
  try {
    const phieuXuats = await PhieuXuatHang.findAll({
      include: [
        { model: DaiLy, as: 'daiLy' },
        {
          model: ChiTiet_PhieuXuat,
          as: 'chiTiets',
          include: [{ model: MatHang, as: 'matHang', include: [{ model: DonViTinh, as: 'dvt' }] }],
        },
      ],
      order: [['MaPhieuXuat', 'DESC']],
    });

    res.json({ status: 'success', data: phieuXuats });
  } catch (error) {
    console.error('PhieuXuat getAll error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * GET /api/phieu-xuat/:id
 */
const getById = async (req, res) => {
  try {
    const phieu = await PhieuXuatHang.findByPk(req.params.id, {
      include: [
        { model: DaiLy, as: 'daiLy', include: [{ model: LoaiDaiLy, as: 'loaiDaiLy' }] },
        {
          model: ChiTiet_PhieuXuat,
          as: 'chiTiets',
          include: [{ model: MatHang, as: 'matHang', include: [{ model: DonViTinh, as: 'dvt' }] }],
        },
      ],
    });

    if (!phieu) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy phiếu xuất.' });
    }

    res.json({ status: 'success', data: phieu });
  } catch (error) {
    console.error('PhieuXuat getById error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * POST /api/phieu-xuat
 * Lập phiếu xuất hàng (BM3)
 * Body: { MaDaiLy, NgayLapPhieu, chiTiets: [{ MaMatHang, TonKho }] }
 *
 * QĐ2: DonGiaXuat = DonGiaNhap × TyLeDonGiaXuat
 * QĐ3: Kiểm tra hạn mức nợ
 * QĐ5: Kiểm tra số lượng tồn
 * QĐ6: Cập nhật tồn kho
 * QĐ7: Cập nhật tiền nợ
 */
const create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { MaDaiLy, NgayLapPhieu, chiTiets, TienTra: tienTraRaw } = req.body;
    const tienTra = Math.max(0, parseFloat(tienTraRaw) || 0);

    if (!chiTiets || chiTiets.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Phiếu xuất phải có ít nhất 1 mặt hàng.',
      });
    }

    // Lấy thông tin đại lý + loại đại lý
    const daiLy = await DaiLy.findByPk(MaDaiLy, {
      include: [{ model: LoaiDaiLy, as: 'loaiDaiLy' }],
      transaction: t,
    });

    if (!daiLy) {
      await t.rollback();
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy đại lý.' });
    }

    // Lấy tham số
    const thamSo = await ThamSo.findOne();
    const tyLe = (thamSo && thamSo.TiLeTinhDonGiaXuat) ? parseFloat(thamSo.TiLeTinhDonGiaXuat) : 1.02;
    const kiemTraNo = (thamSo && typeof thamSo.ApDungQDKiemTraSoTienThu !== 'undefined') ? thamSo.ApDungQDKiemTraSoTienThu : true;
    const kiemTraTon = true; 

    // tính giá
    let tongTien = 0;
    const processedDetails = [];

    for (const ct of chiTiets) {
      const matHang = await MatHang.findByPk(ct.MaMatHang, { transaction: t });
      if (!matHang) {
        await t.rollback();
        return res.status(400).json({ status: 'error', message: `Không tìm thấy mặt hàng có mã ${ct.MaMatHang}.` });
      }

      const soLuongXuat = ct.SoLuongXuat ?? ct.TonKho ?? 0;

      // QĐ5: Kiểm tra tồn kho
      if (kiemTraTon && matHang.TonKho < soLuongXuat) {
        await t.rollback();
        return res.status(400).json({ status: 'error', message: `Mặt hàng "${matHang.TenMatHang}" không đủ tồn kho. Hiện có: ${matHang.TonKho}, cần: ${soLuongXuat}.`, rule: 'QD5' });
      }

      // cập nhật dght
      if (typeof ct.DonGiaHienTai !== 'undefined' && ct.DonGiaHienTai !== null) {
        const newPrice = parseFloat(ct.DonGiaHienTai) || 0;
        await MatHang.update({ DonGiaHienTai: newPrice }, { where: { MaMatHang: ct.MaMatHang }, transaction: t });
        matHang.DonGiaHienTai = newPrice;
      }

      // lấy giá nhập gần nhất
      const lastImport = await ChiTiet_PhieuNhap.findOne({ where: { MaMatHang: ct.MaMatHang }, order: [['MaPhieuNhap', 'DESC']], transaction: t });
      const baseFromRequest = (typeof ct.DonGiaNhap !== 'undefined' && ct.DonGiaNhap !== null) ? parseFloat(ct.DonGiaNhap) : undefined;
      const basePrice = typeof baseFromRequest !== 'undefined' ? baseFromRequest : (matHang.DonGiaHienTai ? parseFloat(matHang.DonGiaHienTai) : (lastImport ? parseFloat(lastImport.DonGiaNhap) : 0));

      const donGiaXuat = Math.round(basePrice * tyLe * 100) / 100;
      const thanhTien = donGiaXuat * soLuongXuat;
      tongTien += thanhTien;

      processedDetails.push({ MaMatHang: ct.MaMatHang, SoLuongXuat: soLuongXuat, DonGiaXuat: donGiaXuat, ThanhTien: thanhTien });
    }

    // QĐ3: Kiểm tra hạn mức nợ
    if (kiemTraNo) {
      const tienNoHienTai = parseFloat(daiLy.TongNo) || 0;
      const tienNoToiDa = parseFloat(daiLy.loaiDaiLy?.TienNoToiDa) || 0;
      const tienNoSauXuat = tienNoHienTai + tongTien;

      if (tienNoSauXuat > tienNoToiDa) {
        await t.rollback();
        return res.status(400).json({
          status: 'error',
          message: `Vượt hạn mức nợ! Nợ hiện tại: ${tienNoHienTai.toLocaleString()}đ, đơn hàng: ${tongTien.toLocaleString()}đ, tổng: ${tienNoSauXuat.toLocaleString()}đ > hạn mức: ${tienNoToiDa.toLocaleString()}đ.`,
          rule: 'QD3',
          data: { tienNoHienTai, tongTien, tienNoSauXuat, tienNoToiDa },
        });
      }
    }

    // 
    const tienTraFinal = Math.min(tienTra, tongTien);
    const insertSql = 'INSERT INTO PHIEUXUATHANG (MaDaiLy, NgayLapPhieu, TongTien, TienTra) VALUES (?, ?, ?, ?)';
    await sequelize.query(insertSql, {
      replacements: [MaDaiLy, NgayLapPhieu || new Date(), tongTien, tienTraFinal],
      transaction: t,
    });
    const [lastInsert] = await sequelize.query('SELECT LAST_INSERT_ID() AS MaPhieuXuat', {
      transaction: t,
      type: QueryTypes.SELECT,
    });
    const phieu = {
      MaPhieuXuat: lastInsert?.MaPhieuXuat,
      MaDaiLy,
      NgayLapPhieu: NgayLapPhieu || new Date(),
      TongTien: tongTien,
    };

    // Tạo chi tiết + cập nhật tồn kho
    for (const ct of processedDetails) {
      await ChiTiet_PhieuXuat.create(
        {
          MaPhieuXuat: phieu.MaPhieuXuat,
          MaMatHang: ct.MaMatHang,
          SoLuongXuat: ct.SoLuongXuat,
          DonGiaXuat: ct.DonGiaXuat,
        },
        { transaction: t, fields: ['MaPhieuXuat', 'MaMatHang', 'SoLuongXuat', 'DonGiaXuat'] }
      );

      // QĐ6: Giảm tồn kho
      await MatHang.decrement('TonKho', {
        by: ct.SoLuongXuat,
        where: { MaMatHang: ct.MaMatHang },
        transaction: t,
      });
    }

    // QĐ7: Cập nhật tiền nợ (chỉ phần chưa trả)
    const noThem = tongTien - tienTraFinal;
    if (noThem > 0) {
      await DaiLy.increment('TongNo', {
        by: noThem,
        where: { MaDaiLy },
        transaction: t,
      });
    }

    await t.commit();

    // Trả về phiếu đầy đủ
    const result = await PhieuXuatHang.findByPk(phieu.MaPhieuXuat, {
      include: [
        { model: DaiLy, as: 'daiLy' },
        {
          model: ChiTiet_PhieuXuat,
          as: 'chiTiets',
          include: [{ model: MatHang, as: 'matHang', include: [{ model: DonViTinh, as: 'dvt' }] }],
        },
      ],
    });

    res.status(201).json({
      status: 'success',
      message: 'Lập phiếu xuất thành công.',
      data: result,
    });
  } catch (error) {
    await t.rollback();
    console.error('PhieuXuat create error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

const update = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const phieuXuat = await PhieuXuatHang.findByPk(req.params.id, {
      include: [{ model: ChiTiet_PhieuXuat, as: 'chiTiets' }],
      transaction: t,
    });

    if (!phieuXuat) {
      await t.rollback();
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy phiếu xuất.' });
    }

    const { MaDaiLy, NgayLapPhieu, chiTiets } = req.body;
    if (!chiTiets || chiTiets.length === 0) {
      await t.rollback();
      return res.status(400).json({ status: 'error', message: 'Phiếu xuất phải có ít nhất 1 mặt hàng.' });
    }

    const oldDetails = phieuXuat.chiTiets || [];
    const oldTotal = parseFloat(phieuXuat.TongTien) || 0;
    const oldAgentId = phieuXuat.MaDaiLy;

    // Khôi phục tồn kho và nợ cũ trước khi áp dụng thay đổi
    for (const oldCt of oldDetails) {
      await MatHang.increment('TonKho', {
        by: oldCt.SoLuongXuat,
        where: { MaMatHang: oldCt.MaMatHang },
        transaction: t,
      });
    }

    if (oldAgentId) {
      await DaiLy.decrement('TongNo', {
        by: oldTotal,
        where: { MaDaiLy: oldAgentId },
        transaction: t,
      });
    }

    const daiLy = await DaiLy.findByPk(MaDaiLy, {
      include: [{ model: LoaiDaiLy, as: 'loaiDaiLy' }],
      transaction: t,
    });
    if (!daiLy) {
      await t.rollback();
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy đại lý.' });
    }

    const thamSo = await ThamSo.findOne({ transaction: t });
    const tyLe = (thamSo && thamSo.TiLeTinhDonGiaXuat) ? parseFloat(thamSo.TiLeTinhDonGiaXuat) : 1.02;
    const kiemTraNo = (thamSo && typeof thamSo.ApDungQDKiemTraSoTienThu !== 'undefined') ? thamSo.ApDungQDKiemTraSoTienThu : true;
    const kiemTraTon = true;

    let tongTien = 0;
    const processedDetails = [];

    for (const ct of chiTiets) {
      const matHang = await MatHang.findByPk(ct.MaMatHang, { transaction: t });
      if (!matHang) {
        await t.rollback();
        return res.status(400).json({ status: 'error', message: `Không tìm thấy mặt hàng có mã ${ct.MaMatHang}.` });
      }

      const soLuongXuat = ct.SoLuongXuat ?? ct.TonKho ?? 0;
      if (kiemTraTon && matHang.TonKho < soLuongXuat) {
        await t.rollback();
        return res.status(400).json({ status: 'error', message: `Mặt hàng "${matHang.TenMatHang}" không đủ tồn kho. Hiện có: ${matHang.TonKho}, cần: ${soLuongXuat}.`, rule: 'QD5' });
      }

      // Nếu client gửi giá hiện tại cập nhật (ct.DonGiaHienTai), cập nhật vào MatHang
      if (typeof ct.DonGiaHienTai !== 'undefined' && ct.DonGiaHienTai !== null) {
        const newPrice = parseFloat(ct.DonGiaHienTai) || 0;
        await MatHang.update({ DonGiaHienTai: newPrice }, { where: { MaMatHang: ct.MaMatHang }, transaction: t });
        matHang.DonGiaHienTai = newPrice;
      }

      const lastImport = await ChiTiet_PhieuNhap.findOne({ where: { MaMatHang: ct.MaMatHang }, order: [['MaPhieuNhap', 'DESC']], transaction: t });
      const baseFromRequest = (typeof ct.DonGiaNhap !== 'undefined' && ct.DonGiaNhap !== null) ? parseFloat(ct.DonGiaNhap) : undefined;
      const basePrice = typeof baseFromRequest !== 'undefined' ? baseFromRequest : (matHang.DonGiaHienTai ? parseFloat(matHang.DonGiaHienTai) : (lastImport ? parseFloat(lastImport.DonGiaNhap) : 0));
      const donGiaXuat = Math.round(basePrice * tyLe * 100) / 100;
      const thanhTien = donGiaXuat * soLuongXuat;
      tongTien += thanhTien;

      processedDetails.push({ MaMatHang: ct.MaMatHang, SoLuongXuat: soLuongXuat, DonGiaXuat: donGiaXuat, ThanhTien: thanhTien });
    }

    if (kiemTraNo) {
      const tienNoHienTai = parseFloat(daiLy.TongNo) || 0;
      const tienNoToiDa = parseFloat(daiLy.loaiDaiLy?.TienNoToiDa) || 0;
      const tienNoSauXuat = tienNoHienTai + tongTien;
      if (tienNoSauXuat > tienNoToiDa) {
        await t.rollback();
        return res.status(400).json({ status: 'error', message: `Vượt hạn mức nợ!`, rule: 'QD3', data: { tienNoHienTai, tongTien, tienNoSauXuat, tienNoToiDa } });
      }
    }

    await ChiTiet_PhieuXuat.destroy({ where: { MaPhieuXuat: phieuXuat.MaPhieuXuat }, transaction: t });

    for (const ct of processedDetails) {
      await ChiTiet_PhieuXuat.create(
        {
          MaPhieuXuat: phieuXuat.MaPhieuXuat,
          MaMatHang: ct.MaMatHang,
          SoLuongXuat: ct.SoLuongXuat,
          DonGiaXuat: ct.DonGiaXuat,
        },
        { transaction: t, fields: ['MaPhieuXuat', 'MaMatHang', 'SoLuongXuat', 'DonGiaXuat'] }
      );
      await MatHang.decrement('TonKho', { by: ct.SoLuongXuat, where: { MaMatHang: ct.MaMatHang }, transaction: t });
    }

    await DaiLy.increment('TongNo', {
      by: tongTien,
      where: { MaDaiLy },
      transaction: t,
    });

    await phieuXuat.update({ MaDaiLy, NgayLapPhieu: NgayLapPhieu || new Date(), TongTien: tongTien }, { transaction: t });

    await t.commit();

    const result = await PhieuXuatHang.findByPk(phieuXuat.MaPhieuXuat, {
      include: [
        { model: DaiLy, as: 'daiLy' },
        { model: ChiTiet_PhieuXuat, as: 'chiTiets', include: [{ model: MatHang, as: 'matHang', include: [{ model: DonViTinh, as: 'dvt' }] }] },
      ],
    });

    res.json({ status: 'success', message: 'Cập nhật phiếu xuất thành công.', data: result });
  } catch (error) {
    await t.rollback();
    console.error('PhieuXuat update error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

const remove = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const phieuXuat = await PhieuXuatHang.findByPk(req.params.id, {
      include: [{ model: ChiTiet_PhieuXuat, as: 'chiTiets' }],
      transaction: t,
    });

    if (!phieuXuat) {
      await t.rollback();
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy phiếu xuất.' });
    }

    const total = parseFloat(phieuXuat.TongTien) || 0;
    for (const ct of phieuXuat.chiTiets || []) {
      await MatHang.increment('TonKho', {
        by: ct.SoLuongXuat,
        where: { MaMatHang: ct.MaMatHang },
        transaction: t,
      });
    }

    await DaiLy.decrement('TongNo', {
      by: total,
      where: { MaDaiLy: phieuXuat.MaDaiLy },
      transaction: t,
    });

    await ChiTiet_PhieuXuat.destroy({ where: { MaPhieuXuat: phieuXuat.MaPhieuXuat }, transaction: t });
    await phieuXuat.destroy({ transaction: t });

    await t.commit();
    res.json({ status: 'success', message: 'Xóa phiếu xuất thành công.' });
  } catch (error) {
    await t.rollback();
    console.error('PhieuXuat remove error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
