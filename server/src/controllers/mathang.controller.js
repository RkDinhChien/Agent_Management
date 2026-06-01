const { MatHang, DonViTinh, ChiTiet_PhieuNhap, ChiTiet_PhieuXuat } = require('../models');

/**
 * GET /api/mat-hang
 */
const getAll = async (req, res) => {
  try {
    const matHangs = await MatHang.findAll({
      include: [{ model: DonViTinh, as: 'dvt' }],
      order: [['MaMatHang', 'ASC']],
    });
    res.json({ status: 'success', data: matHangs });
  } catch (error) {
    console.error('MatHang getAll error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * POST /api/mat-hang
 */
const create = async (req, res) => {
  try {
    const matHang = await MatHang.create(req.body);
    const result = await MatHang.findByPk(matHang.MaMatHang, {
      include: [{ model: DonViTinh, as: 'dvt' }],
    });
    res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    console.error('MatHang create error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * PUT /api/mat-hang/:id
 */
const update = async (req, res) => {
  try {
    const matHang = await MatHang.findByPk(req.params.id);
    if (!matHang) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy mặt hàng.' });
    }
    await matHang.update(req.body);
    const result = await MatHang.findByPk(req.params.id, {
      include: [{ model: DonViTinh, as: 'dvt' }],
    });
    res.json({ status: 'success', data: result });
  } catch (error) {
    console.error('MatHang update error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * DELETE /api/mat-hang/:id
 */
const remove = async (req, res) => {
  try {
    const matHang = await MatHang.findByPk(req.params.id);
    if (!matHang) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy mặt hàng.' });
    }
    // Kiểm tra tồn tại trong chi tiết phiếu nhập/phiếu xuất
    const usedInNhap = await ChiTiet_PhieuNhap.count({ where: { MaMatHang: req.params.id } });
    const usedInXuat = await ChiTiet_PhieuXuat.count({ where: { MaMatHang: req.params.id } });
    if (usedInNhap > 0 || usedInXuat > 0) {
      return res.status(400).json({ status: 'error', message: 'Không thể xóa mặt hàng: đang được sử dụng trong phiếu nhập/phiếu xuất.' });
    }

    await matHang.destroy();
    res.json({ status: 'success', message: 'Xóa mặt hàng thành công.' });
  } catch (error) {
    console.error('MatHang delete error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getAll, create, update, remove };
