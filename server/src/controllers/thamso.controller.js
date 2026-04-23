const { ThamSo } = require('../models');

/**
 * GET /api/tham-so
 * Lấy tất cả tham số hệ thống
 */
const getAll = async (req, res) => {
  try {
    const thamSos = await ThamSo.findAll({ order: [['MaThamSo', 'ASC']] });
    res.json({ status: 'success', data: thamSos });
  } catch (error) {
    console.error('ThamSo getAll error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * PUT /api/tham-so/:id
 * Cập nhật tham số (QĐ8 - Admin only)
 */
const update = async (req, res) => {
  try {
    const thamSo = await ThamSo.findByPk(req.params.id);
    if (!thamSo) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy tham số.' });
    }

    await thamSo.update({ GiaTri: req.body.GiaTri });
    res.json({ status: 'success', message: 'Cập nhật tham số thành công.', data: thamSo });
  } catch (error) {
    console.error('ThamSo update error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getAll, update };
