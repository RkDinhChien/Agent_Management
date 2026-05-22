const { ChucNang } = require('../models');

const getAll = async (req, res) => {
  try {
    const items = await ChucNang.findAll({ order: [['MaChucNang', 'ASC']] });
    res.json({ status: 'success', data: items });
  } catch (error) {
    console.error('ChucNang getAll error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getAll };
