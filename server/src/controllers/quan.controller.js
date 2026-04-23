const { Quan, DaiLy } = require('../models');

/**
 * GET /api/quan
 */
const getAll = async (req, res) => {
  try {
    const quans = await Quan.findAll({ order: [['MaQuan', 'ASC']] });
    res.json({ status: 'success', data: quans });
  } catch (error) {
    console.error('Quan getAll error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getAll };
