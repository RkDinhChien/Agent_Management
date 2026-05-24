const { LoaiDaiLy } = require('../models');

/**
 * GET /api/loai-dai-ly
 */
const getAll = async (req, res) => {
  try {
    const loais = await LoaiDaiLy.findAll({ order: [['MaLoaiDaiLy', 'ASC']] });
    res.json({ status: 'success', data: loais });
  } catch (error) {
    console.error('LoaiDaiLy getAll error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getAll };
