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

const aggregateChiTietXuat = (chiTiets) => {
  const itemMap = new Map();
  for (const ct of chiTiets || []) {
    if (!ct || !ct.MaMatHang) continue;
    const maMatHang = ct.MaMatHang;
    const existing = itemMap.get(maMatHang) || {
      MaMatHang: maMatHang,
      SoLuongXuat: 0,
      DonGiaNhap: undefined,
      DonGiaHienTai: undefined,
    };

    // Chỉ lấy SoLuongXuat từ request, không dùng TonKho (tồn kho DB)
    const lineQty = Number(ct.SoLuongXuat ?? 0);
    existing.SoLuongXuat += Number.isFinite(lineQty) ? lineQty : 0;

    if (typeof ct.DonGiaNhap !== 'undefined' && ct.DonGiaNhap !== null) {
      existing.DonGiaNhap = parseFloat(ct.DonGiaNhap);
    }
    if (typeof ct.DonGiaHienTai !== 'undefined' && ct.DonGiaHienTai !== null) {
      existing.DonGiaHienTai = parseFloat(ct.DonGiaHienTai);
    }

    itemMap.set(maMatHang, existing);
  }
  return Array.from(itemMap.values());
};

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

    console.log('=== PHIEU XUAT CREATE ===');
    console.log('Raw chiTiets input:', JSON.stringify(chiTiets));

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
    const tyLe = parseFloat(thamSo?.TiLeTinhDonGiaXuat) || 1.02;
    const kiemTraNo = typeof thamSo?.ApDungQDKiemTraSoTienThu !== 'undefined'
      ? Boolean(thamSo.ApDungQDKiemTraSoTienThu)
      : true;
    const kiemTraTon = true;

    const normalizedChiTiets = aggregateChiTietXuat(chiTiets);
    console.log('After aggregation:', JSON.stringify(normalizedChiTiets));

    // tính giá
    let tongTien = 0;
    const processedDetails = [];

    for (const ct of normalizedChiTiets) {
      const matHang = await MatHang.findByPk(ct.MaMatHang, { transaction: t });
      if (!matHang) {
        await t.rollback();
        return res.status(400).json({ status: 'error', message: `Không tìm thấy mặt hàng có mã ${ct.MaMatHang}.` });
      }

      // Chỉ dùng SoLuongXuat từ aggregation, không dùng TonKho
      const soLuongXuat = ct.SoLuongXuat;

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

    // Tính tiền trả cuối cùng và phần nợ
    const tienTraFinal = Math.min(tienTra, tongTien);
    const conLai = Math.max(0, tongTien - tienTraFinal);
    
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
      console.log(`Creating detail: MaMatHang=${ct.MaMatHang}, SoLuongXuat=${ct.SoLuongXuat}`);
      
      await ChiTiet_PhieuXuat.create(
        {
          MaPhieuXuat: phieu.MaPhieuXuat,
          MaMatHang: ct.MaMatHang,
          SoLuongXuat: ct.SoLuongXuat,
          DonGiaXuat: ct.DonGiaXuat,
        },
        { transaction: t, fields: ['MaPhieuXuat', 'MaMatHang', 'SoLuongXuat', 'DonGiaXuat'] }
      );
    }

    // QĐ7: Cập nhật tiền nợ (chỉ phần chưa trả = ConLai)
    if (conLai > 0) {
      await DaiLy.increment('TongNo', {
        by: conLai,
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
    res.status(500).json({ status: 'error', message: 'Lỗi server.', error: error.message });
  }
};

const update = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    console.debug('PhieuXuat update payload:', req.params.id, req.body);
    const phieuXuat = await PhieuXuatHang.findByPk(req.params.id, {
      include: [{ model: ChiTiet_PhieuXuat, as: 'chiTiets' }],
      transaction: t,
    });

    if (!phieuXuat) {
      await t.rollback();
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy phiếu xuất.' });
    }

    const { MaDaiLy, NgayLapPhieu, chiTiets, TienTra: tienTraRaw } = req.body;
    const tienTra = Math.max(0, parseFloat(tienTraRaw) || 0);

    // Basic payload validation to avoid internal server errors
    if (!MaDaiLy) {
      await t.rollback();
      return res.status(400).json({ status: 'error', message: 'MaDaiLy (mã đại lý) không được để trống.' });
    }
    if (!chiTiets || !Array.isArray(chiTiets) || chiTiets.length === 0) {
      await t.rollback();
      return res.status(400).json({ status: 'error', message: 'Phiếu xuất phải có ít nhất 1 mặt hàng.' });
    }
    for (const [idx, ct] of chiTiets.entries()) {
      if (!ct.MaMatHang) {
        await t.rollback();
        return res.status(400).json({ status: 'error', message: `Mặt hàng ở vị trí ${idx + 1} thiếu MaMatHang.` });
      }
      if (typeof ct.SoLuongXuat === 'undefined' || isNaN(Number(ct.SoLuongXuat))) {
        await t.rollback();
        return res.status(400).json({ status: 'error', message: `Mặt hàng ở vị trí ${idx + 1} có SoLuongXuat không hợp lệ.` });
      }
      if (typeof ct.DonGiaXuat === 'undefined' || isNaN(Number(ct.DonGiaXuat))) {
        await t.rollback();
        return res.status(400).json({ status: 'error', message: `Mặt hàng ở vị trí ${idx + 1} có DonGiaXuat không hợp lệ.` });
      }
    }
    console.debug('Validated update payload:', { MaDaiLy, NgayLapPhieu, tienTra, chiTietsLength: chiTiets.length });

    const oldDetails = phieuXuat.chiTiets || [];
    const oldTotal = parseFloat(phieuXuat.TongTien) || 0;
    const oldTienTra = parseFloat(phieuXuat.TienTra) || 0;
    const oldOwed = Math.max(0, oldTotal - oldTienTra);
    const oldAgentId = phieuXuat.MaDaiLy;

    if (oldAgentId && oldOwed > 0) {
      await DaiLy.decrement('TongNo', {
        by: oldOwed,
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
    const tyLe = parseFloat(thamSo?.TiLeTinhDonGiaXuat) || 1.02;
    const kiemTraNo = typeof thamSo?.ApDungQDKiemTraSoTienThu !== 'undefined'
      ? Boolean(thamSo.ApDungQDKiemTraSoTienThu)
      : true;
    const kiemTraTon = true;

    const normalizedChiTiets = aggregateChiTietXuat(chiTiets);

    let tongTien = 0;
    const processedDetails = [];

    for (const ct of normalizedChiTiets) {
      const matHang = await MatHang.findByPk(ct.MaMatHang, { transaction: t });
      if (!matHang) {
        await t.rollback();
        return res.status(400).json({ status: 'error', message: `Không tìm thấy mặt hàng có mã ${ct.MaMatHang}.` });
      }

      // Chỉ dùng SoLuongXuat từ aggregation, không dùng TonKho
      const soLuongXuat = ct.SoLuongXuat;
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

    const tienTraFinal = Math.min(tienTra, tongTien);
    const conLai = Math.max(0, tongTien - tienTraFinal);

    if (kiemTraNo) {
      const tienNoHienTai = parseFloat(daiLy.TongNo) || 0;
      const tienNoToiDa = parseFloat(daiLy.loaiDaiLy?.TienNoToiDa) || 0;
      const tienNoSauXuat = tienNoHienTai + conLai;
      if (tienNoSauXuat > tienNoToiDa) {
        await t.rollback();
        return res.status(400).json({ status: 'error', message: `Vượt hạn mức nợ!`, rule: 'QD3', data: { tienNoHienTai, conLai, tienNoSauXuat, tienNoToiDa } });
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
    }

    if (conLai > 0) {
      await DaiLy.increment('TongNo', {
        by: conLai,
        where: { MaDaiLy },
        transaction: t,
      });
    }

    await phieuXuat.update({ MaDaiLy, NgayLapPhieu: NgayLapPhieu || new Date(), TongTien: tongTien, TienTra: tienTraFinal }, { transaction: t });

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
    res.status(500).json({ status: 'error', message: 'Lỗi server.', error: error.message, stack: error.stack });
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

    // Hoàn tồn kho và giảm nợ (chỉ phần chưa trả = ConLai)
    const total = parseFloat(phieuXuat.TongTien) || 0;
    const tienTra = parseFloat(phieuXuat.TienTra) || 0;
    const conLai = Math.max(0, total - tienTra);
    
    // Xóa chi tiết cũ (DB trigger sẽ điều chỉnh `TonKho` tương ứng)

    // Chỉ giảm nợ cho phần chưa trả (ConLai)
    if (conLai > 0) {
      await DaiLy.decrement('TongNo', {
        by: conLai,
        where: { MaDaiLy: phieuXuat.MaDaiLy },
        transaction: t,
      });
    }

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
