const { ThamSo } = require('../models');

/**
 * GET /api/tham-so
 * Lấy tham số hệ thống
 */
const getAll = async (req, res) => {
  try {
    const thamSo = await ThamSo.findOne();
    if (!thamSo) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy tham số.' });
    }
    res.json({ status: 'success', data: thamSo });
  } catch (error) {
    console.error('ThamSo getAll error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * PUT /api/tham-so
 * Cập nhật tham số (QĐ8 - Admin only)
 */
const update = async (req, res) => {
  try {
    const thamSo = await ThamSo.findOne();
    if (!thamSo) {
      return res.status(404).json({ status: 'error', message: 'Không tìm thấy tham số.' });
    }

    await thamSo.update(req.body);
    res.json({ status: 'success', message: 'Cập nhật tham số thành công.', data: thamSo });
  } catch (error) {
    console.error('ThamSo update error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getAll, update };
