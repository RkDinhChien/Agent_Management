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
    const { MaDaiLy, NgayLapPhieu, chiTiets } = req.body;

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
    const kiemTraTon = true; // migration không có cột tương ứng, giữ mặc định true

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
      if (kiemTraTon && matHang.TonKho < ct.TonKho) {
        await t.rollback();
        return res.status(400).json({
          status: 'error',
          message: `Mặt hàng "${matHang.TenMatHang}" không đủ tồn kho. Hiện có: ${matHang.TonKho}, cần: ${ct.TonKho}.`,
          rule: 'QD5',
        });
      }

      // QĐ2: Tính đơn giá xuất = đơn giá nhập × tỷ lệ
      // Lấy giá nhập gần nhất
      const lastImport = await CT_PNH.findOne({
        where: { MaMatHang: ct.MaMatHang },
        order: [['MaPhieuNhap', 'DESC']],
        transaction: t,
      });

      const donGiaNhap = lastImport ? parseFloat(lastImport.DonGiaNhap) : 0;
      const donGiaXuat = Math.round(donGiaNhap * tyLe);
      const thanhTien = donGiaXuat * ct.TonKho;
      tongTien += thanhTien;

      processedDetails.push({
        MaMatHang: ct.MaMatHang,
        TonKho: ct.TonKho,
        DonGiaXuat: donGiaXuat,
        ThanhTien: thanhTien,
      });
    }

    // QĐ3: Kiểm tra hạn mức nợ
    if (kiemTraNo) {
      const tienNoHienTai = parseFloat(daiLy.TongNo) || 0;
      const tienNoToiDa = parseFloat(daiLy.loaiDaiLy.TienNoToiDa) || 0;
      const tienNoSauXuat = tienNoHienTai + tongTien;

      if (tienNoSauXuat > soNoToiDa) {
        await t.rollback();
        return res.status(400).json({
          status: 'error',
          message: `Vượt hạn mức nợ! Nợ hiện tại: ${tienNoHienTai.toLocaleString()}đ, đơn hàng: ${tongTien.toLocaleString()}đ, tổng: ${tienNoSauXuat.toLocaleString()}đ > hạn mức: ${tienNoToiDa.toLocaleString()}đ.`,
          rule: 'QD3',
          data: { tienNoHienTai, tongTien, tienNoSauXuat, tienNoToiDa },
        });
      }
    }

    // Tạo phiếu xuất
    const phieu = await PhieuXuatHang.create(
      { MaDaiLy, NgayLapPhieu: NgayLapPhieu || new Date(), TongTien: tongTien },
      { transaction: t }
    );

    // Tạo chi tiết + cập nhật tồn kho
    for (const ct of processedDetails) {
      await ChiTiet_PhieuXuat.create(
        { MaPhieuXuat: phieu.MaPhieuXuat, ...ct },
        { transaction: t }
      );

      // QĐ6: Giảm tồn kho
      await MatHang.decrement('TonKho', {
        by: ct.TonKho,
        where: { MaMatHang: ct.MaMatHang },
        transaction: t,
      });
    }

    // QĐ7: Cập nhật tiền nợ
    await DaiLy.increment('TongNo', {
      by: tongTien,
      where: { MaDaiLy },
      transaction: t,
    });

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

module.exports = { getAll, getById, create };
