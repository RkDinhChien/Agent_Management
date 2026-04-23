const {
  sequelize,
  PhieuXuatHang,
  CT_PXH,
  DaiLy,
  LoaiDaiLy,
  MatHang,
  DVT,
  ThamSo,
  CT_PNH,
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
          model: CT_PXH,
          as: 'chiTiets',
          include: [{ model: MatHang, as: 'matHang', include: [{ model: DVT, as: 'dvt' }] }],
        },
      ],
      order: [['MaPX', 'DESC']],
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
          model: CT_PXH,
          as: 'chiTiets',
          include: [{ model: MatHang, as: 'matHang', include: [{ model: DVT, as: 'dvt' }] }],
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
 * Body: { MaDaiLy, NgayXuat, chiTiets: [{ MaMatHang, SoLuong }] }
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
    const { MaDaiLy, NgayXuat, chiTiets } = req.body;

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
    const tyLeThamSo = await ThamSo.findOne({ where: { TenThamSo: 'TyLeDonGiaXuat' } });
    const tyLe = tyLeThamSo ? parseFloat(tyLeThamSo.GiaTri) : 1.02;

    const kiemTraNoThamSo = await ThamSo.findOne({ where: { TenThamSo: 'KiemTraTienNo' } });
    const kiemTraNo = kiemTraNoThamSo ? kiemTraNoThamSo.GiaTri === '1' : true;

    const kiemTraTonThamSo = await ThamSo.findOne({ where: { TenThamSo: 'KiemTraSoLuongTon' } });
    const kiemTraTon = kiemTraTonThamSo ? kiemTraTonThamSo.GiaTri === '1' : true;

    // Xử lý chi tiết + tính giá
    let tongTien = 0;
    const processedDetails = [];

    for (const ct of chiTiets) {
      const matHang = await MatHang.findByPk(ct.MaMatHang, { transaction: t });
      if (!matHang) {
        await t.rollback();
        return res.status(400).json({
          status: 'error',
          message: `Không tìm thấy mặt hàng có mã ${ct.MaMatHang}.`,
        });
      }

      // QĐ5: Kiểm tra tồn kho
      if (kiemTraTon && matHang.SoLuongTon < ct.SoLuong) {
        await t.rollback();
        return res.status(400).json({
          status: 'error',
          message: `Mặt hàng "${matHang.TenMatHang}" không đủ tồn kho. Hiện có: ${matHang.SoLuongTon}, cần: ${ct.SoLuong}.`,
          rule: 'QD5',
        });
      }

      // QĐ2: Tính đơn giá xuất = đơn giá nhập × tỷ lệ
      // Lấy giá nhập gần nhất
      const lastImport = await CT_PNH.findOne({
        where: { MaMatHang: ct.MaMatHang },
        order: [['MaPN', 'DESC']],
        transaction: t,
      });

      const donGiaNhap = lastImport ? parseFloat(lastImport.DonGiaNhap) : 0;
      const donGiaXuat = Math.round(donGiaNhap * tyLe);
      const thanhTien = donGiaXuat * ct.SoLuong;
      tongTien += thanhTien;

      processedDetails.push({
        MaMatHang: ct.MaMatHang,
        SoLuong: ct.SoLuong,
        DonGiaXuat: donGiaXuat,
        ThanhTien: thanhTien,
      });
    }

    // QĐ3: Kiểm tra hạn mức nợ
    if (kiemTraNo) {
      const tienNoHienTai = parseFloat(daiLy.TienNo) || 0;
      const soNoToiDa = parseFloat(daiLy.loaiDaiLy.SoNoToiDa) || 0;
      const tienNoSauXuat = tienNoHienTai + tongTien;

      if (tienNoSauXuat > soNoToiDa) {
        await t.rollback();
        return res.status(400).json({
          status: 'error',
          message: `Vượt hạn mức nợ! Nợ hiện tại: ${tienNoHienTai.toLocaleString()}đ, đơn hàng: ${tongTien.toLocaleString()}đ, tổng: ${tienNoSauXuat.toLocaleString()}đ > hạn mức: ${soNoToiDa.toLocaleString()}đ.`,
          rule: 'QD3',
          data: { tienNoHienTai, tongTien, tienNoSauXuat, soNoToiDa },
        });
      }
    }

    // Tạo phiếu xuất
    const phieu = await PhieuXuatHang.create(
      { MaDaiLy, NgayXuat: NgayXuat || new Date(), TongTien: tongTien },
      { transaction: t }
    );

    // Tạo chi tiết + cập nhật tồn kho
    for (const ct of processedDetails) {
      await CT_PXH.create(
        { MaPX: phieu.MaPX, ...ct },
        { transaction: t }
      );

      // QĐ6: Giảm tồn kho
      await MatHang.decrement('SoLuongTon', {
        by: ct.SoLuong,
        where: { MaMatHang: ct.MaMatHang },
        transaction: t,
      });
    }

    // QĐ7: Cập nhật tiền nợ
    await DaiLy.increment('TienNo', {
      by: tongTien,
      where: { MaDaiLy },
      transaction: t,
    });

    await t.commit();

    // Trả về phiếu đầy đủ
    const result = await PhieuXuatHang.findByPk(phieu.MaPX, {
      include: [
        { model: DaiLy, as: 'daiLy' },
        {
          model: CT_PXH,
          as: 'chiTiets',
          include: [{ model: MatHang, as: 'matHang', include: [{ model: DVT, as: 'dvt' }] }],
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

module.exports = { getAll, getById, create };
