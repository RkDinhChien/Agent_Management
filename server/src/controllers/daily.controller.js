const { DaiLy, LoaiDaiLy, Quan, ThamSo, PhieuXuatHang, PhieuThuTien, ChiTiet_PhieuXuat, MatHang } = require('../models');
const { Op } = require('sequelize');

/**
 * GET /api/dai-ly
 * Lấy danh sách đại lý
 */
const getAll = async (req, res) => {
  try {
    const daiLys = await DaiLy.findAll({
      include: [
        { model: LoaiDaiLy, as: 'loaiDaiLy' },
        { model: Quan, as: 'quan' },
      ],
      order: [['MaDaiLy', 'DESC']],
    });

    res.json({ status: 'success', data: daiLys });
  } catch (error) {
    console.error('DaiLy getAll error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * GET /api/dai-ly/:id
 * Lấy chi tiết đại lý
 */
const getById = async (req, res) => {
  try {
    const daiLy = await DaiLy.findByPk(req.params.id, {
      include: [
        { model: LoaiDaiLy, as: 'loaiDaiLy' },
        { model: Quan, as: 'quan' },
      ],
    });

    if (!daiLy) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy đại lý.' });
    }

    res.json({ status: 'success', data: daiLy });
  } catch (error) {
    console.error('DaiLy getById error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * POST /api/dai-ly
 * Thêm đại lý mới (BM1)
 * Kiểm tra QĐ1: Số đại lý tối đa trong 1 quận
 */
const create = async (req, res) => {
  try {
    const { TenDaiLy, MaLoaiDaiLy, MaQuan, SDT, DiaChi, Email, NgayTiepNhan } = req.body;

    // QĐ1: Kiểm tra số đại lý tối đa trong quận
    const thamSo = await ThamSo.findOne();
    const soDaiLyToiDa = thamSo && thamSo.SoDaiLyToiDa ? parseInt(thamSo.SoDaiLyToiDa) : 4;

    const soDaiLyHienTai = await DaiLy.count({ where: { MaQuan } });
    if (soDaiLyHienTai >= soDaiLyToiDa) {
      return res.status(400).json({
        status: 'error',
        message: `Quận này đã đạt số đại lý tối đa (${soDaiLyToiDa}). Không thể thêm mới.`,
        rule: 'QD1',
      });
    }
// them đại lý
    const daiLy = await DaiLy.create({
      TenDaiLy,
      MaLoaiDaiLy,
      MaQuan,
      SDT,
      DiaChi,
      Email,
      NgayTiepNhan: NgayTiepNhan || new Date(),
      TongNo: 0,
    });

    const result = await DaiLy.findByPk(daiLy.MaDaiLy, {
      include: [
        { model: LoaiDaiLy, as: 'loaiDaiLy' },
        { model: Quan, as: 'quan' },
      ],
    });

    res.status(201).json({ status: 'success', message: 'Thêm đại lý thành công.', data: result });
  } catch (error) {
    console.error('DaiLy create error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * PUT /api/dai-ly/:id
 * Cập nhật đại lý
 */
const update = async (req, res) => {
  try {
    const daiLy = await DaiLy.findByPk(req.params.id);
    if (!daiLy) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy đại lý.' });
    }

    // Nếu đổi quận, kiểm tra QĐ1
    if (req.body.MaQuan && req.body.MaQuan !== daiLy.MaQuan) {
      const thamSo = await ThamSo.findOne();
      const soDaiLyToiDa = thamSo && thamSo.SoDaiLyToiDa ? parseInt(thamSo.SoDaiLyToiDa) : 4;
      const soDaiLyHienTai = await DaiLy.count({ where: { MaQuan: req.body.MaQuan } });
      if (soDaiLyHienTai >= soDaiLyToiDa) {
        return res.status(400).json({
          status: 'error',
          message: `Quận đích đã đạt số đại lý tối đa (${soDaiLyToiDa}).`,
          rule: 'QD1',
        });
      }
    }

    await daiLy.update(req.body);

    const result = await DaiLy.findByPk(req.params.id, {
      include: [
        { model: LoaiDaiLy, as: 'loaiDaiLy' },
        { model: Quan, as: 'quan' },
      ],
    });

    res.json({ status: 'success', message: 'Cập nhật thành công.', data: result });
  } catch (error) {
    console.error('DaiLy update error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * DELETE /api/dai-ly/:id
 * Xóa đại lý
 */
const remove = async (req, res) => {
  try {
    const daiLy = await DaiLy.findByPk(req.params.id);
    if (!daiLy) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy đại lý.' });
    }

    await daiLy.destroy();
    res.json({ status: 'success', message: 'Xóa đại lý thành công.' });
  } catch (error) {
    console.error('DaiLy delete error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * GET /api/dai-ly/check-quan/:maQuan
 * Kiểm tra số đại lý trong quận (QĐ1)
 */
const checkQuan = async (req, res) => {
  try {
    const thamSo = await ThamSo.findOne();
    const soDaiLyToiDa = thamSo && thamSo.SoDaiLyToiDa ? parseInt(thamSo.SoDaiLyToiDa) : 4;
    const soDaiLyHienTai = await DaiLy.count({ where: { MaQuan: req.params.maQuan } });

    res.json({
      status: 'success',
      data: {
        MaQuan: parseInt(req.params.maQuan),
        soDaiLyHienTai,
        soDaiLyToiDa,
        conThem: soDaiLyHienTai < soDaiLyToiDa,
      },
    });
  } catch (error) {
    console.error('DaiLy checkQuan error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * GET /api/dai-ly/:id/lich-su
 * Lấy lịch sử giao dịch (phiếu xuất + phiếu thu) của đại lý
 */
const getLichSu = async (req, res) => {
  try {
    const { id } = req.params;

    const daiLy = await DaiLy.findByPk(id, {
      include: [
        { model: LoaiDaiLy, as: 'loaiDaiLy' },
        { model: Quan, as: 'quan' },
      ],
    });

    if (!daiLy) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy đại lý.' });
    }

    // Lấy phiếu xuất hàng
    const phieuXuats = await PhieuXuatHang.findAll({
      where: { MaDaiLy: id },
      order: [['NgayXuat', 'DESC']],
    });

    // Lấy phiếu thu tiền
    const phieuThus = await PhieuThuTien.findAll({
      where: { MaDaiLy: id },
      order: [['NgayThu', 'DESC']],
    });

    // Thống kê
    const tongDoanhThu = phieuXuats.reduce((s, p) => s + parseFloat(p.TongTien || 0), 0);
    const tongDaThu = phieuThus.reduce((s, p) => s + parseFloat(p.SoTienThu || 0), 0);

    res.json({
      status: 'success',
      data: {
        daiLy,
        phieuXuats,
        phieuThus,
        thongKe: {
          tongPhieuXuat: phieuXuats.length,
          tongDoanhThu,
          tongPhieuThu: phieuThus.length,
          tongDaThu,
          conNo: parseFloat(daiLy.TienNo || 0),
        },
      },
    });
  } catch (error) {
    console.error('DaiLy getLichSu error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getAll, getById, create, update, remove, checkQuan, getLichSu };
